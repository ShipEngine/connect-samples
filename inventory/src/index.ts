import { InventoryAppDefinition } from '@shipengine/connect-inventory-api';
import * as handlers from './app';
import { sampleMetadata } from './metadata';

export default {
  Metadata: sampleMetadata,
  startFetch: handlers.startFetch,
  getFetchResults: handlers.fetchResults,
  startPush: handlers.startPush,
  getPushResults: handlers.pushResults,
} satisfies InventoryAppDefinition;
