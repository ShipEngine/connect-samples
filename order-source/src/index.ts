import { OrderSourceAppDefinition } from '@shipengine/connect-order-source-api';
import {
  SalesOrdersExport,
  ShipmentNotification,
  AcknowledgeOrders,
  GetProducts,
  GetPackingSlipTemplate
} from './methods';
import { Metadata } from './definitions';

export default {
  SalesOrdersExport,
  ShipmentNotification,
  AcknowledgeOrders,
  GetProducts,
  GetPackingSlipTemplate,
  Metadata,
} satisfies OrderSourceAppDefinition;
