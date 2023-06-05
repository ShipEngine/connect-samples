import { GetProductsRequest, GetProductsResponse } from '@shipengine/connect-order-source-api';
import { presentPsGetProductRequest, toProduct } from './get-products.presenters';
import * as client from '../../client';
import { validateAuthorization } from '../common/utils';
import { handlerError } from '../common/error-handler';
import { BadRequestError } from '@shipengine/connect-runtime';

export const GetProducts = async (request: GetProductsRequest): Promise<GetProductsResponse> => {
  validateAuthorization(request);
  if (!request.product_ids) {
    throw new BadRequestError('Product id`s is missing');
  }

  try {
    const products = await Promise.all(request.product_ids.map(productId => Promise.all([
      client.getProduct(presentPsGetProductRequest(request, productId)),
      client.getColorOfProduct(presentPsGetProductRequest(request, productId)),
    ])));

    return { products: products.map(toProduct) };
  } catch (e) {
    throw handlerError(e);
  }
};
