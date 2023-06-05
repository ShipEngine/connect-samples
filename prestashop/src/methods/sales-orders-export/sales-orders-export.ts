import {
  SalesOrdersExportRequest,
  SalesOrdersExportResponse,
} from '@shipengine/connect-order-source-api';
import * as client from '../../client';
import {
  presentGetOrderRequest,
  presentGetOrdersRequest,
  presentSalesOrdersExportResponse,
} from './sales-orders-export.presenters';
import { validateAuthorization } from '../common/utils';
import { handlerError } from '../common/error-handler';

export const SalesOrdersExport = async (request: SalesOrdersExportRequest): Promise<SalesOrdersExportResponse> => {
  validateAuthorization(request);

  try {
    const getOrdersRes = await client.getOrders(presentGetOrdersRequest(request));
    const getOrderDescRes = await Promise.all(getOrdersRes.orders.map(
      (order) => client.getFullOrderData(presentGetOrderRequest(request, order.id)),
    ));
    return presentSalesOrdersExportResponse(request, getOrderDescRes);
  } catch (e) {
    throw handlerError(e);
  }
};
