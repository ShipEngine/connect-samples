import { ShipmentNotificationResult } from '@shipengine/connect-order-source-api/lib/models';
import {
  NotificationStatus,
  ShipmentNotification,
  ShipmentNotificationRequest,
} from '@shipengine/connect-order-source-api';
import {
  AddCarrierRequest,
  AddOrderCarrierRequest,
  AddOrderHistoryRequest,
  GetCarrierRequest,
} from '../../client/client.models';
import { OrderState } from '../../client/resources';
import { PsRequestError } from '../../client/error';
import { FILTER_NAME } from '../common/filters';

export function presentAddOrderHistoryRequest(
  req: ShipmentNotificationRequest,
  notification: ShipmentNotification,
): AddOrderHistoryRequest {
  return {
    key: req.auth.api_key,
    id_order: Number(notification.order_number),
    id_order_state: OrderState.Shipped,
  };
}

export function presentGetCarrierRequest(req: ShipmentNotificationRequest, carrierName: string): GetCarrierRequest {
  return {
    key: req.auth.api_key,
    filter: [
      {
        name: FILTER_NAME.FilterName,
        value: `[${carrierName}]`,
      },
    ],
  };
}

export function presentAddCarrierRequest(
  req: ShipmentNotificationRequest,
  notification: ShipmentNotification,
): AddCarrierRequest {
  return {
    key: req.auth.api_key,
    name: notification.carrier_code,
    // Delay is a required field for PS
    // Used # and @_ for correct conversion to XML
    delay: [{ language: { '@_id': '1', '#text': ' ' } }],
    active: '1',
  };
}

export function presentAddOrderCarrierRequest(
  req: ShipmentNotificationRequest,
  notification: ShipmentNotification,
  carrierId: number,
): AddOrderCarrierRequest {
  return {
    key: req.auth.api_key,
    id: Number(notification.order_number),
    id_carrier: carrierId,
    id_order: Number(notification.order_number),
    tracking_number: Number(notification.tracking_number),
  };
}

export function presentSuccessShipmentNotification(notification: ShipmentNotification)
  : ShipmentNotificationResult {
  return {
    notification_id: notification.notification_id,
    status: NotificationStatus.success,
  };
}

export function presentFailShipmentNotification(notification: ShipmentNotification, err: PsRequestError)
  : ShipmentNotificationResult {
  return {
    notification_id: notification.notification_id,
    status: NotificationStatus.failure,
    failure_reason: err.message,
  };
}
