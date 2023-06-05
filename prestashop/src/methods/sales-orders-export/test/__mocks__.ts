/* eslint-disable max-lines */
import {
  SalesOrdersExportRequest,
  SalesOrdersExportResponse,
} from '@shipengine/connect-order-source-api';
import { connectionContext } from '../../test/__mocks__';
import {
  GetOrdersResponse,
} from '../../../client/client.models';
import {
  Address,
  Country,
  Order,
  OrderState,
} from '../../../client/resources';
import { SalesOrderStatus } from '@shipengine/connect-order-source-api/lib/models/sales-order';

const country: Country = {
  id: '21',
  id_zone: '2',
  id_currency: '0',
  iso_code: 'US',
  contains_states: true,
  need_zip_code: true,
  zip_code_format: 'NNNNN',
  name: [
    {
      id: '1',
      value: 'United States',
    },
  ],
};

const address: Address = {
  id: '1',
  id_customer: '2',
  id_manufacturer: '0',
  id_supplier: '0',
  id_warehouse: '0',
  id_country: '21',
  id_state: '12',
  alias: 'My address',
  company: 'My Company',
  lastname: 'DOE',
  firstname: 'John',
  vat_number: '',
  address1: '16, Main street',
  address2: '2nd floor',
  postcode: '33133',
  city: 'Miami',
  other: '',
  phone: '0102030405',
  phone_mobile: '',
  dni: '',
  deleted: false,
  date_add: '2021-05-17 10:55:03',
  date_upd: '2021-05-17 10:55:03',
  country,
};

export const order: Order = {
  id: 1,
  currency: 'EUR',
  id_address_delivery: '5',
  address_delivery: address,
  id_address_invoice: '5',
  address_invoice: address,
  id_cart: '5',
  id_currency: '1',
  id_lang: '1',
  id_customer: '2',
  id_carrier: '2',
  current_state: OrderState.Shipped,
  module: 'ps_wirepayment',
  invoice_number: '0',
  invoice_date: '2021-05-17 10:55:06',
  delivery_number: '0',
  delivery_date: '2021-05-17 10:55:06',
  valid: false,
  date_add: '2021-05-17 10:55:06',
  date_upd: '2021-05-17 10:55:06',
  shipping_number: '',
  id_shop_group: '1',
  id_shop: '1',
  secure_key: 'b44a6d9efd7a0076a0fbce6b15eaf3b1',
  payment: 'Bank wire',
  recyclable: false,
  gift: false,
  gift_message: '',
  total_paid: 0,
  total_discounts: 18.64,
  total_paid_real: 0,
  total_products: 0,
  total_products_wt: 0,
  conversion_rate: 0,
  reference: 'KHWLILZLL',
  email: 'pub@prestashop.com',
  associations: {
    order_rows: [
      {
        id: '7',
        product_id: '10',
        product_attribute_id: '25',
        product_quantity: 1,
        product_name: 'Brown bear cushion Color : Black',
        product_reference: 'demo_16',
        product_ean13: '',
        product_isbn: '',
        product_upc: '',
        product_price: 18.900000,
        unit_price_tax_excl: 18.900000,
        id_customization: '0',
      },
    ],
  },
};

export const pickupOrder: Order = {
  ...order,
  order_carrier_detail: {
    orderId: 1,
    orderReference: '1',
    carrierId: 12,
    carrierName: '1',
    carrierModule: '1',
    locationId: 21,
    isPickup: 1,
    locationAddress: {
      companyName: 'My Company',
      address1: '16, Main street',
      address2: '2nd floor',
      address3: '1',
      city: 'Miami',
      zipCode: '33133',
      country: 'US',
      countryIso: 'US',
    },
  },
};

export const getOrdersResponse: GetOrdersResponse = {
  orders: [{ id: 1 }],
};

export const salesOrdersExportRequest: SalesOrdersExportRequest = {
  transaction_id: '1',
  auth: {
    order_source_api_code: '1',
    api_key: connectionContext.api_key,
  },
};

export const salesOrdersExportResponse: SalesOrdersExportResponse = {
  sales_orders: [
    {
      order_id: '1',
      currency: 'EUR',
      status: SalesOrderStatus.Completed,
      paid_date: '2021-05-17T10:55:06.000Z',
      fulfilled_date: '2021-05-17T10:55:06.000Z',
      notes: [],
      payment: {
        amount_paid: 0,
        adjustments: [
          {
            amount: -18.64,
            description: 'Product discount',
          },
        ],
      },
      modified_date_time: '2021-05-17T10:55:06.000Z',
      order_number: '1',
      requested_fulfillments: [
        {
          ship_to: {
            name: 'John DOE',
            phone: '0102030405',
            company: 'My Company',
            address_line_1: '16, Main street',
            address_line_2: '2nd floor',
            city: 'Miami',
            postal_code: '33133',
            country_code: 'US',
          },
          items: [
            {
              description: 'Brown bear cushion Color : Black',
              quantity: 1,
              taxes: [],
              unit_price: 18.9,
              product: {
                product_id: '10',
                name: 'Brown bear cushion Color : Black',
                unit_cost: 18.9,
                identifiers: {
                  isbn: '',
                  upc: '',
                },
              },
            },
          ],
        },
      ],
      bill_to: {
        name: 'John DOE',
        phone: '0102030405',
        company: 'My Company',
        address_line_1: '16, Main street',
        address_line_2: '2nd floor',
        city: 'Miami',
        postal_code: '33133',
        country_code: 'US',
      },
      buyer: {
        buyer_id: '2',
        email: 'pub@prestashop.com',
        name: 'John DOE',
        phone: '0102030405',
      },
    },
  ],
  cursor: null,
};

export const salesOrdersExportResponsePickup: SalesOrdersExportResponse = {
  sales_orders: [
    {
      order_id: '1',
      status: SalesOrderStatus.Completed,
      currency: 'EUR',
      paid_date: '2021-05-17T10:55:06.000Z',
      fulfilled_date: '2021-05-17T10:55:06.000Z',
      modified_date_time: '2021-05-17T10:55:06.000Z',
      order_number: '1',
      notes: [],
      payment: {
        amount_paid: 0,
        adjustments: [
          {
            amount: -18.64,
            description: 'Product discount',
          },
        ],
      },
      requested_fulfillments: [
        {
          ship_to: {
            company: 'My Company',
            address_line_1: '16, Main street',
            address_line_2: '2nd floor',
            address_line_3: '1',
            city: 'Miami',
            postal_code: '33133',
            country_code: 'US',
            pickup_location: {
              relay_id: '21',
              carrier_id: '12',
            },
          },
          items: [
            {
              description: 'Brown bear cushion Color : Black',
              quantity: 1,
              unit_price: 18.9,
              taxes: [],
              product: {
                product_id: '10',
                name: 'Brown bear cushion Color : Black',
                unit_cost: 18.9,
                identifiers: {
                  isbn: '',
                  upc: '',
                },
              },
            },
          ],
        },
      ],
      bill_to: {
        name: 'John DOE',
        phone: '0102030405',
        company: 'My Company',
        address_line_1: '16, Main street',
        address_line_2: '2nd floor',
        city: 'Miami',
        postal_code: '33133',
        country_code: 'US',
      },
      buyer: {
        buyer_id: '2',
        email: 'pub@prestashop.com',
        name: 'John DOE',
        phone: '0102030405',
      },
    },
  ],
  cursor: null,
};
