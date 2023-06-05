import {
  DimensionsUnit,
  GetProductsRequest,
  Product,
  WeightUnit,
} from '@shipengine/connect-order-source-api';
import * as currency from 'currency.js';
import {
  GetColorResponse,
  GetProductRequest as PsGetProductRequest,
  GetProductResponse as PsGetProductResponse,
} from '../../client/client.models';

export const toProduct = ([{ product: prod }, color]: [PsGetProductResponse, GetColorResponse]): Product => ({
  product_id: prod.id.toString(),
  name: prod.name[0]?.value,
  description: prod.description[0]?.value,
  identifiers: {
    isbn: prod.isbn,
    upc: prod.upc,
  },
  details: [
    prod.available_now[0]?.value && {
      name: 'availableNow',
      value: prod.available_now[0]?.value,
    },
    Number(prod.quantity) && {
      name: 'quantity',
      value: prod.quantity,
    },
    prod.available_later[0]?.value && {
      name: 'availableLater',
      value: prod.available_later[0]?.value,
    },
    prod.unity && {
      name: 'unity',
      value: prod.unity,
    },
    prod.wholesale_price && {
      name: 'wholesalePrice',
      value: currency(prod.wholesale_price).toString(),
    },
    color.product_option_value.color && {
      name: 'color',
      value: color.product_option_value.color,
    },
  ].filter(Boolean),
  unit_cost: currency(prod.price).value,
  weight: {
    value: Number(prod.weight),
    unit: WeightUnit.Kilogram,
  },
  dimensions: {
    height: Number(prod.height),
    length: Number(prod.depth),
    width: Number(prod.width),
    unit: DimensionsUnit.Centimeter,
  },
  location: prod.location,
});

export function presentPsGetProductRequest(request: GetProductsRequest, productId: string): PsGetProductRequest {
  return { key: request.auth.api_key, productId };
}
