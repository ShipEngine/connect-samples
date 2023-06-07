import { UnauthorizedError } from '@shipengine/connect-runtime';
import * as client from '../../../client';
import {
  addCarrierResponse,
  addOrderCarrierResponse,
  addOrderHistoryResponse,
  shipmentNotificationRequest,
  shipmentNotificationResponseFailed,
  shipmentNotificationResponseSuccess,
} from './__mocks__';
import { ShipmentNotification } from '../shipment-notification';
import { PsRequestError } from '../../../client/error';

describe('Test_ShipmentNotification', () => {
  let addOrderHistoryMock = null;
  let getCarrierMock = null;
  let addOrderCarrierMock = null;
  let addCarrierMock = null;

  beforeEach(() => {
    jest.clearAllMocks();
    addOrderHistoryMock = jest
      .spyOn(client, 'addOrderHistory')
      .mockImplementation(() => Promise.resolve(addOrderHistoryResponse));
    getCarrierMock = jest
      .spyOn(client, 'getCarrier')
      .mockImplementation(() => Promise.resolve(null));
    addOrderCarrierMock = jest
      .spyOn(client, 'addOrderCarrier')
      .mockImplementation(() => Promise.resolve(addOrderCarrierResponse));
    addCarrierMock = jest
      .spyOn(client, 'addCarrier')
      .mockImplementation(() => Promise.resolve(addCarrierResponse));
  });

  it('Should_ReturnNotificationResults_When_RequestIsValid', async () => {
    await expect(ShipmentNotification(shipmentNotificationRequest))
      .resolves.toEqual(shipmentNotificationResponseSuccess);
    expect(addCarrierMock).toBeCalled();
    expect(addOrderHistoryMock).toBeCalled();
    expect(getCarrierMock).toBeCalled();
    expect(addOrderCarrierMock).toBeCalled();
  });

  it('Should_ThrowUnauthorizedError_When_AuthKeyIsMissing', async () => {
    await expect(ShipmentNotification({
      ...shipmentNotificationRequest,
      auth: {
        order_source_api_code: '',
      },
    })).rejects.toThrow(UnauthorizedError);
    expect(addCarrierMock).not.toBeCalled();
    expect(addOrderHistoryMock).not.toBeCalled();
    expect(getCarrierMock).not.toBeCalled();
    expect(addOrderCarrierMock).not.toBeCalled();
  });

  it('Should_ReturnFailedNotification_When_PsThrowsError', async () => {
    getCarrierMock = jest
      .spyOn(client, 'getCarrier')
      .mockImplementation(() => Promise.reject(new PsRequestError('Test Error')));

    await expect(ShipmentNotification(shipmentNotificationRequest))
      .resolves.toEqual(shipmentNotificationResponseFailed);
    expect(getCarrierMock).toBeCalled();
    expect(addCarrierMock).not.toBeCalled();
    expect(addOrderHistoryMock).not.toBeCalled();
    expect(addOrderCarrierMock).not.toBeCalled();
  });
});
