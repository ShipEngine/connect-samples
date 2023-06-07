import { AuthenticationType, OrderSourceAppMetadata } from '@shipengine/connect-order-source-api';
import { prestashop } from './order-source';

export const Metadata: OrderSourceAppMetadata = {
  // DO NOT CHANGE THIS ID AFTER PUBLISHING
  Id: 'a50fd7a6-d042-453d-930c-f7b29cdd6441',
  Name: 'prestashop-v2',
  AuthProcess: {
    Identifier: {
      AuthenticationType: AuthenticationType.ApiKey,
      IsSandbox: false,
    },
  },
  OrderSources: [prestashop],
};
