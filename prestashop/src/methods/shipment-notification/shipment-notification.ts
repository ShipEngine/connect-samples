import {
  ShipmentNotificationRequest,
  ShipmentNotificationResponse,
} from '@shipengine/connect-order-source-api';
import * as client from '../../client';
import { validateAuthorization } from '../common/utils';
import {
  presentAddCarrierRequest,
  presentAddOrderCarrierRequest,
  presentAddOrderHistoryRequest,
  presentFailShipmentNotification,
  presentGetCarrierRequest,
  presentSuccessShipmentNotification,
} from './shipment-notification.presenters';
import { ShipmentNotificationResult } from '@shipengine/connect-order-source-api/lib/models';

export async function ShipmentNotification(
  request: ShipmentNotificationRequest,
): Promise<ShipmentNotificationResponse> {
  validateAuthorization(request);

  const res: ShipmentNotificationResult[] = [];
  await Promise.all(request.notifications.map(async (notification) => {
    try {
      let carrierId: number = null;
      const carriers = await client.getCarrier(presentGetCarrierRequest(request, notification.carrier_code));

      if (carriers && carriers.length) {
        carrierId = Number(carriers[0].id);
      } else {
        const { id } = await client.addCarrier(presentAddCarrierRequest(request, notification));
        carrierId = id;
      }

      await client.addOrderCarrier(presentAddOrderCarrierRequest(request, notification, carrierId));

      await client.addOrderHistory(presentAddOrderHistoryRequest(request, notification));

      res.push(presentSuccessShipmentNotification(notification));
    } catch (e) {
      res.push(presentFailShipmentNotification(notification, e));
    }
  }));
  return {
    notification_results: res,
  };
}
