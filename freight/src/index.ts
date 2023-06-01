import { FreightAppDefinition } from '@shipengine/connect-freight-api';
import {
  ConnectFreightCarrier,
  FreightQuote,
  FreightShipmentDocuments,
  FreightSpotQuote,
  ScheduleFreightPickup,
  TrackFreightShipment,
} from './methods';
import { Metadata } from './definitions';

export default {
  Metadata,
  ConnectFreightCarrier,
  FreightQuote,
  FreightShipmentDocuments,
  FreightSpotQuote,
  ScheduleFreightPickup,
  TrackFreightShipment,
} satisfies FreightAppDefinition;
