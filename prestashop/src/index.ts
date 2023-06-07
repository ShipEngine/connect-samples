import type { OrderSourceAppDefinition } from '@shipengine/connect-order-source-api';
import {
  GetProducts,
  SalesOrdersExport,
  ShipmentNotification,
} from './methods';
import {
  Metadata,
} from './definitions';

export default {
  SalesOrdersExport,
  ShipmentNotification,
  GetProducts,
  Metadata,
} satisfies OrderSourceAppDefinition;
