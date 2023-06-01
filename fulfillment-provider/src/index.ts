import type { FulfillmentProviderAppDefinition } from '@shipengine/connect-fulfillment-provider-api';
import {
    cancelFulfillment,
    connect,
    delegateFulfillment,
    getFulfillments,
    getInventory,
    getRates,
    getRecentChanges,
} from './methods';
import {
    metadata
} from './definitions';

export default {
  cancelFulfillment,
    connect,
    delegateFulfillment,
    getFulfillments,
    getInventory,
    getRates,
    getRecentChanges,
    Metadata: metadata,
} satisfies FulfillmentProviderAppDefinition;
