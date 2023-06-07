import { DimensionsUnit, GetProductsRequest, WeightUnit } from '@shipengine/connect-order-source-api';
import { GetColorResponse, GetProductResponse as PsGetProductResponse } from '../../../client/client.models';

export const getProductParameters: GetProductsRequest = {
  auth: {
    api_key: 'key',
    order_source_api_code: '',
  },
  product_ids: ['1'],
  transaction_id: '',
};

export const getProductParametersWithEmptyKey: GetProductsRequest = {
  auth: {
    api_key: '',
    order_source_api_code: '',
  },
  product_ids: [
    '1',
    '12',
  ],
  transaction_id: '',
};

export const getProductParametersWithEmptyIDs: GetProductsRequest = {
  auth: {
    api_key: '123',
    order_source_api_code: '',
  },
  transaction_id: '',
};

export const color: GetColorResponse = {
  product_option_value: {
    color: 'red',
    id: '4',
  },
};

export const getProductSuccessResponse: PsGetProductResponse = {
  product: {
    id: 1,
    id_default_image: '',
    quantity: '',
    width: '',
    height: '',
    depth: '',
    weight: '',
    isbn: '',
    upc: '',
    price: '',
    location: '',
    name: [
      {
        id: '',
        value: '',
      },
    ],
    description: [
      {
        id: '',
        value: '',
      },
    ],
    wholesale_price: '',
    unity: '',
    available_now: [
      {
        id: '',
        value: '',
      },
    ],
    available_later: [
      {
        id: '',
        value: '',
      },
    ],
  },
};

export const response = {
  product_id: String(getProductSuccessResponse.product.id),
  name: getProductSuccessResponse.product.name[0]?.value,
  description: getProductSuccessResponse.product.description[0]?.value,
  identifiers: {
    isbn: getProductSuccessResponse.product.isbn,
    upc: getProductSuccessResponse.product.upc,
  },
  details: [
    {
      name: 'color',
      value: color.product_option_value.color,
    },
  ],
  unit_cost: Number(getProductSuccessResponse.product.price),
  weight: {
    value: Number(getProductSuccessResponse.product.weight),
    unit: WeightUnit.Kilogram,
  },
  dimensions: {
    height: Number(getProductSuccessResponse.product.height),
    length: Number(getProductSuccessResponse.product.depth),
    width: Number(getProductSuccessResponse.product.width),
    unit: DimensionsUnit.Centimeter,
  },
  location: getProductSuccessResponse.product.location,
};
