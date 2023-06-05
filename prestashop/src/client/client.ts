/* eslint-disable max-lines */
import axios, {
  AxiosBasicCredentials,
  AxiosError,
  AxiosHeaders,
  AxiosResponse,
} from 'axios';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import * as https from 'https';
import {
  AddCarrierRequest,
  AddCarrierResponse,
  AddOrderCarrierRequest,
  AddOrderCarrierResponse,
  AddOrderHistoryRequest,
  AddOrderHistoryResponse,
  BaseRequest,
  GetAddressRequest,
  GetAddressResponse,
  GetCarrierRequest,
  GetCarrierResponse,
  GetColorResponse,
  GetCountryRequest,
  GetCountryResponse,
  GetCurrencyRequest,
  GetCurrencyResponse,
  GetCustomerRequest,
  GetCustomerResponse,
  GetOrderCarrierDetailRequest,
  GetOrderCarrierDetailResponse,
  GetOrderRequest,
  GetOrderResponse,
  GetOrdersRequest,
  GetOrdersResponse,
  GetProductRequest,
  GetProductResponse,
  RequestError,
} from './client.models';
import { HttpStatusCode, logger } from '@shipengine/connect-runtime';
import {
  PsBadRequestError,
  PsRequestError,
  PsUnauthorizedError,
} from './error';

const xmlBuilder = new XMLBuilder({
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  ignoreAttributes: false,
});

const xmlParser = new XMLParser({
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  ignoreAttributes: false,
});

const PS_API_URL = process.env.PS_API_URL || 'https://shipstation.demo-niak.prestashop.net/api';
const PS_API_TIMEOUT = Number.parseInt(process.env.PS_API_TIMEOUT ?? '60000');
const PS_TLS_REJECT_UNAUTHORIZED = Boolean(process.env.PS_TLS_REJECT_UNAUTHORIZED) || false;

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT'
}

const DEFAULT_HEADERS: Record<string, string> = {
  'Output-Format': 'JSON',
};

enum API_RESOURCE {
  Orders = '/orders',
  OrdersCarrierDetail = '/order_carrier_detail',
  OrderHistories = '/order_histories',
  Countries = '/countries',
  Addresses = '/addresses',
  Products = '/products',
  OrderCarrier = '/order_carriers',
  ProductOptionValues = '/product_option_values',
  Customers = '/customers',
  Currencies ='/currencies',
  Carriers = '/carriers',
  OrderDetails = '/order_details',
}

const client = axios.create({
  baseURL: PS_API_URL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: PS_TLS_REJECT_UNAUTHORIZED,
  }),
  timeout: PS_API_TIMEOUT,
});

client.interceptors.request.use((config) => {
  // if req is GET -> force PrestaShop to return JSON
  if (config.method.toUpperCase() === HttpMethod.GET) {
    config.headers = new AxiosHeaders(DEFAULT_HEADERS);
  }
  if (config.method.toUpperCase() === HttpMethod.POST) {
    config.data = { prestashop: config.data };
  }
  if (config.method.toUpperCase() === HttpMethod.PUT) {
    config.data = { prestashop: config.data };
  }
  if (config.data) {
    config.data = xmlBuilder.build(config.data);
  }
  return config;
});

client.interceptors.response.use((res: AxiosResponse<string>) => {
  // if req was GET -> do not modify data
  if (res.request?.method.toUpperCase() === HttpMethod.GET) {
    return res;
  }

  const parsedData = xmlParser.parse(res.data);
  res.data = parsedData.prestashop;
  return res;
}, (err) => handleError(err));

function logError(err: AxiosError<RequestError>): void {
  if (process.env.NODE_ENV === 'local') {
    logger.debug('Failed to send request');
    console.log('Request\n', err.config);
    console.log('Response\n', err.response?.data || err.message);
  }
}

function handleError(err: AxiosError<RequestError>) {
  logError(err);
  if (!err.response) {
    throw new PsRequestError(err.message);
  }

  const data = err.response?.data;
  if (err.response.status === 400) {
    throw new PsBadRequestError(data);
  }
  if (err.response.status === 401) {
    throw new PsUnauthorizedError(data);
  }
  if (err.response.status === 500) {
    throw new PsRequestError(data);
  }
}

function getAuthData(req: BaseRequest): AxiosBasicCredentials {
  return {
    username: req.key,
    password: '',
  };
}

export async function getOrders(req: GetOrdersRequest): Promise<GetOrdersResponse> {
  const { limit, filter } = req;
  const params: Record<string, string> = {};
  if (limit) {
    params.limit = `${limit.index},${limit.limit}`;
  }
  if (filter && filter.length) {
    filter.forEach(f => {
      params[f.name] = f.value;
    });
  }

  const { data: res } = await client.request<GetOrdersResponse>({
    method: HttpMethod.GET,
    url: API_RESOURCE.Orders,
    auth: getAuthData(req),
    params,
  });
  // service could return empty array instead of object with empty orders
  // in this case we'll return it manually
  if (!res.orders) {
    return { orders: [] };
  }
  return res;
}

export async function getCountry(req: GetCountryRequest): Promise<GetCountryResponse> {
  const { data: res } = await client.request<GetCountryResponse>({
    method: HttpMethod.GET,
    url: `${API_RESOURCE.Countries}/${req.country_id}`,
    auth: getAuthData(req),
  });
  return res;
}

export async function getAddress(req: GetAddressRequest): Promise<GetAddressResponse> {
  const { data: res } = await client.request<GetAddressResponse>({
    method: HttpMethod.GET,
    url: `${API_RESOURCE.Addresses}/${req.address_id}`,
    auth: getAuthData(req),
  });

  const { country } = await getCountry({ country_id: res.address.id_country, key: req.key });
  res.address.country = country;

  return res;
}

export async function getOrderCarrierDetail(req: GetOrderCarrierDetailRequest): Promise<GetOrderCarrierDetailResponse> {
  const { data: rawXmlData } = await axios({
    method: HttpMethod.GET,
    url: `${PS_API_URL}/${API_RESOURCE.OrdersCarrierDetail}/${req.order_id}`,
    auth: getAuthData(req),
  });
  return xmlParser.parse(rawXmlData);
}

export async function getFullOrderData(req: GetOrderRequest): Promise<GetOrderResponse> {
  const { data: res } = await client.request<GetOrderResponse>({
    method: HttpMethod.GET,
    url: `${API_RESOURCE.Orders}/${req.order_id}`,
    auth: getAuthData(req),
  });

  const { order } = res;
  const [
    { address: adrD },
    { address: adrI },
    { customer: { email } },
    { currency: { iso_code } },
  ] = await Promise.all([
    getAddress({ address_id: order.id_address_delivery, key: req.key }),
    getAddress({ address_id: order.id_address_invoice, key: req.key }),
    getCustomer({ customer_id: order.id_customer, key: req.key }),
    getCurrency({ currency_id: order.id_currency, key: req.key }),
  ]);
  order.address_delivery = adrD;
  order.address_invoice = adrI;
  order.email = email;
  order.currency = iso_code;

  try {
    if (!order.associations?.order_rows[0]?.id) {
      return res;
    }
    order.order_carrier_detail = await getOrderCarrierDetail({
      order_id: order.associations.order_rows[0].id,
      key: req.key,
    });
  } catch (e) {
    if (e.response?.status !== HttpStatusCode.NotFound) {
      handleError(e);
    }
  }

  return res;
}

export async function getProduct(req: GetProductRequest): Promise<GetProductResponse> {
  const { key, productId } = req;
  const { data: responseData } = await client.request<GetProductResponse>({
    method: HttpMethod.GET,
    url: `${API_RESOURCE.Products}/${productId}`,
    auth: {
      username: key,
      password: '',
    },
  });

  return responseData;
}

export async function getColorOfProduct(req: GetProductRequest): Promise<GetColorResponse> {
  const { key, productId } = req;
  const { data: responseData } = await client.request<GetColorResponse>({
    method: HttpMethod.GET,
    url: `${API_RESOURCE.ProductOptionValues}/${productId}`,
    auth: {
      username: key,
      password: '',
    },
  });
  return responseData;
}

export async function addOrderHistory(req: AddOrderHistoryRequest): Promise<AddOrderHistoryResponse> {
  const { key, id_order, id_order_state } = req;

  const { data: responseData } = await client.request<{ order_history: AddOrderHistoryResponse; }>({
    method: HttpMethod.POST,
    url: `${API_RESOURCE.OrderHistories}`,
    auth: {
      username: key,
      password: '',
    },
    data: {
      order_history: { id_order, id_order_state },
    },
  });

  return responseData.order_history;
}

export async function getCustomer(req: GetCustomerRequest): Promise<GetCustomerResponse> {
  const { data: res } = await client.request<GetCustomerResponse>({
    method: HttpMethod.GET,
    url: `${API_RESOURCE.Customers}/${req.customer_id}`,
    auth: getAuthData(req),
  });

  return res;
}

export async function getCurrency(req: GetCurrencyRequest): Promise<GetCurrencyResponse> {
  const { currency_id } = req;
  const { data: responseData } = await client.request<GetCurrencyResponse>({
    method: HttpMethod.GET,
    url: `${API_RESOURCE.Currencies}/${currency_id}`,
    auth: getAuthData(req),
  });

  return responseData;
}

export async function addOrderCarrier(req: AddOrderCarrierRequest): Promise<AddOrderCarrierResponse> {
  const { data: responseData } = await client.request<{ order_carrier: AddOrderCarrierResponse; }>({
    method: HttpMethod.PUT,
    url: `${API_RESOURCE.OrderCarrier}`,
    auth: getAuthData(req),
    data: {
      order_carrier: { ...req },
    },
  });
  return responseData.order_carrier;
}

export async function getCarrier(req: GetCarrierRequest): Promise<GetCarrierResponse[]> {
  const { filter } = req;
  const params: Record<string, string> = {};
  filter.forEach(f => {
    params[f.name] = f.value;
  });
  const { data: responseData } = await client.request<{carriers: GetCarrierResponse[];}>({
    method: HttpMethod.GET,
    url: `${API_RESOURCE.Carriers}`,
    auth: getAuthData(req),
    params,
  });
  return responseData.carriers;
}

export async function addCarrier(req: AddCarrierRequest): Promise<AddCarrierResponse> {
  const { data: responseData } = await client.request<{ carrier: AddCarrierResponse; }>({
    method: HttpMethod.POST,
    url: `${API_RESOURCE.Carriers}`,
    auth: getAuthData(req),
    data: {
      carrier: { delay: req.delay, name: req.name, active: req.active },
    },
  });

  return responseData.carrier;
}
