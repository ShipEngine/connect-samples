import {
  NotificationStatus,
  ShipmentNotificationRequest,
  ShipmentNotificationResponse,
} from '@shipengine/connect-order-source-api';
import { ShipmentNotification } from '@shipengine/connect-order-source-api/lib/requests/shipment-notification-request';
import {
  AddCarrierResponse,
  AddOrderCarrierResponse,
  AddOrderHistoryResponse,
} from '../../../client/client.models';
import { OrderState } from '../../../client/resources';
import { connectionContext } from '../../test/__mocks__';

export const addOrderHistoryResponse: AddOrderHistoryResponse = {
  id: '1',
  id_order: '1',
  date_add: '2021-05-17 10:55:06',
  id_order_state: OrderState.PaymentAccepted,
  id_employee: '1',
};

export const notification: ShipmentNotification = {
  notification_id: '1',
  order_id: '1',
  items: [],
  integration_context: {},
};

export const addCarrierResponse: AddCarrierResponse = {
  id: 24,
  deleted: null,
  is_module: null,
  id_tax_rules_group: 'false',
  id_reference: '',
  name: 'GLS Canada',
  active: '1',
  is_free: null,
  url: null,
  shipping_handling: null,
  shipping_external: null,
  range_behavior: null,
  shipping_method: null,
  max_width: null,
  max_height: null,
  max_depth: null,
  max_weight: null,
  grade: null,
  external_module_name: null,
  need_range: null,
  position: '17',
  delay: [],
};

export const addOrderCarrierResponse: AddOrderCarrierResponse = {
  date_add: '2222-22-22 22:22:22',
  id_carrier: 3,
  id_order: 63,
  shipping_cost_tax_excl: 23,
  shipping_cost_tax_incl: 23,
  tracking_number: 3123,
  weight: 2323,
};

export const shipmentNotificationRequest: ShipmentNotificationRequest = {
  transaction_id: '1',
  auth: {
    order_source_api_code: '1',
    api_key: connectionContext.api_key,
  },
  notifications: [notification],
};

export const shipmentNotificationResponseSuccess: ShipmentNotificationResponse = {
  notification_results: [
    {
      notification_id: notification.notification_id,
      status: NotificationStatus.success,
    },
  ],
};

export const shipmentNotificationResponseFailed: ShipmentNotificationResponse = {
  notification_results: [
    {
      notification_id: notification.notification_id,
      status: NotificationStatus.failure,
      failure_reason: 'Test Error',
    },
  ],
};
