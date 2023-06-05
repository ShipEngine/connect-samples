import {
  Address,
  Country,
  Customer,
  Order,
  OrderCarrierDetail,
  OrderId,
  OrderState,
  Value,
} from './resources';

export interface ErrorEntry {
  code: number;
  message: string;
}

export interface RequestError {
  errors: ErrorEntry[];
}

export interface BaseRequest {
  key: string;
}

export interface FilterEntry {
  name: string;
  value: string;
}

export interface Limit {
  index: number;
  limit: number;
}

export interface GetCountryRequest extends BaseRequest {
  country_id: string;
}

export interface GetCountryResponse {
  country: Country;
}

export interface GetAddressRequest extends BaseRequest {
  address_id: string;
}

export interface GetAddressResponse {
  address: Address;
}

export interface GetOrderCarrierDetailRequest extends BaseRequest {
  order_id: string;
}

export type GetOrderCarrierDetailResponse = OrderCarrierDetail;

export interface GetOrdersRequest extends BaseRequest {
  filter?: FilterEntry[];
  limit?: Limit;
}

export interface GetOrdersResponse {
  orders: OrderId[];
}

export interface GetOrderRequest extends BaseRequest {
  order_id: number;
}

export interface GetOrderResponse {
  order: Order;
}

export interface GetCurrencyRequest extends BaseRequest {
  currency_id: string;
}

export interface Currency{
  id: number;
  names: Value[];
  name: string;
  symbol: Value[];
  iso_code: string;
  numeric_iso_code: string;
  precision: string;
  conversion_rate: string;
  deleted: string;
  active: string;
  unofficial: string;
  modified: string;
  pattern: Value[];
}

export interface GetCurrencyResponse {
  currency: Currency;
}

export interface GetProductRequest extends BaseRequest {
  productId: string;
}

export interface ProductId {
  id: string;
}

export interface AllProducts {
  product: ProductId[];
}

interface Color {
  color: string;
  id: string;
}

export interface GetColorResponse {
  product_option_value: Color;
}

export interface PsProduct {
  id: number;
  id_default_image?: string;
  quantity?: string;
  width?: string;
  height?: string;
  depth?: string;
  weight?: string;
  isbn?: string;
  upc?: string;
  price: string;
  location?: string;
  name?: Value[];
  description?: Value[];
  wholesale_price?: string;
  unity?: string;
  available_now?: Value[];
  available_later?: Value[];
}

export interface GetProductResponse {
  product: PsProduct;
}

export interface AddOrderHistoryRequest extends BaseRequest {
  id_order: number;
  id_order_state: OrderState;
}

export interface AddOrderCarrierResponse {
  id_order: number;
  id_carrier: number;
  weight?: number;
  shipping_cost_tax_excl?: number;
  shipping_cost_tax_incl?: number;
  tracking_number?: number;
  date_add?: string;
}

export interface AddOrderCarrierRequest extends BaseRequest {
  id: number;
  id_order: number;
  id_carrier: number;
  tracking_number?: number;
  weight?: number;
  shipping_cost_tax_incl?: number;
  shipping_cost_tax_excl?: number;
}

export interface GetCarrierRequest extends BaseRequest {
  filter?: FilterEntry[];
}

export interface Delay {
  language: {
    '@_id': string;
    '#text': string;
  };
}

export interface AddCarrierResponse {
  id?: number;
  deleted?: string;
  is_module?: string;
  id_tax_rules_group?: string;
  id_reference?: string;
  name: string;
  active: string;
  is_free?: string;
  url?: string;
  shipping_handling?: string;
  shipping_external?: string;
  range_behavior?: string;
  shipping_method?: string;
  max_width?: string;
  max_height?: string;
  max_depth?: string;
  max_weight?: string;
  grade?: string;
  external_module_name?: string;
  need_range?: string;
  position?: string;
  delay: Delay[];
}

export interface AddCarrierRequest extends AddCarrierResponse, BaseRequest {}

export interface GetCarrierResponse {
  id: string;
}

export interface AddOrderHistoryResponse {
  id: string;
  id_employee: string;
  id_order_state: string;
  id_order: string;
  date_add: string;
}

export interface GetCustomerRequest extends BaseRequest {
  customer_id: string;
}

export interface GetCustomerResponse {
  customer: Customer;
}

export interface GetCustomerRequest extends BaseRequest {
  customer_id: string;
}

export interface GetCustomerResponse {
  customer: Customer;
}
