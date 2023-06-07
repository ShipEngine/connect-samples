import {
  ExternalServerError,
  UnauthorizedError,
} from '@shipengine/connect-runtime';
import * as client from '../../../client';
import {
  getOrdersResponse,
  order,
  pickupOrder,
  salesOrdersExportRequest,
  salesOrdersExportResponse,
  salesOrdersExportResponsePickup,
} from './__mocks__';
import { SalesOrdersExport } from '../sales-orders-export';
import { PsRequestError } from '../../../client/error';

describe('Test_SalesOrdersExport', () => {
  let getOrdersMock = null;
  let getOrderMock = null;

  beforeEach(() => {
    jest.clearAllMocks();
    getOrdersMock = jest
      .spyOn(client, 'getOrders')
      .mockImplementation(() => Promise.resolve(getOrdersResponse));
    getOrderMock = jest
      .spyOn(client, 'getFullOrderData')
      .mockImplementation(() => Promise.resolve({ order }));
  });

  it('Should_ExportOrders_When_RequestIsValid', async () => {
    await expect(SalesOrdersExport(salesOrdersExportRequest)).resolves.toEqual(salesOrdersExportResponse);
    expect(getOrdersMock).toBeCalled();
    expect(getOrderMock).toBeCalled();
  });

  it('Should_ReturnPickupOrderInfo_When_PsReturnsPickupOrder', async () => {
    getOrderMock = jest
      .spyOn(client, 'getFullOrderData')
      .mockImplementation(() => Promise.resolve({ order: pickupOrder }));

    await expect(SalesOrdersExport(salesOrdersExportRequest)).resolves.toEqual(salesOrdersExportResponsePickup);
    expect(getOrdersMock).toBeCalled();
    expect(getOrderMock).toBeCalled();
  });

  it('Should_ThrowUnauthorizedError_When_AuthKeyIsMissing', async () => {
    await expect(SalesOrdersExport({
      ...salesOrdersExportRequest,
      auth: {
        order_source_api_code: '1',
        api_key: '',
      },
    })).rejects.toThrow(UnauthorizedError);
    expect(getOrdersMock).not.toBeCalled();
    expect(getOrderMock).not.toBeCalled();
  });

  it('Should_ThrowExternalError_When_PsGetOrdersThrowsError', async () => {
    getOrdersMock = jest
      .spyOn(client, 'getOrders')
      .mockImplementation(() => Promise.reject(new PsRequestError('Test Error')));

    await expect(SalesOrdersExport(salesOrdersExportRequest)).rejects.toThrow(ExternalServerError);
    expect(getOrdersMock).toBeCalled();
    expect(getOrderMock).not.toBeCalled();
  });

  it('Should_ThrowExternalError_When_PsGetOrderThrowsError', async () => {
    getOrdersMock = jest
      .spyOn(client, 'getOrders')
      .mockImplementation(() => Promise.reject(new PsRequestError('Test Error')));

    await expect(SalesOrdersExport(salesOrdersExportRequest)).rejects.toThrow(ExternalServerError);
    expect(getOrdersMock).toBeCalled();
    expect(getOrderMock).not.toBeCalled();
  });
});
