import type { CarrierAppDefinition } from '@shipengine/connect-carrier-api';
import {
  Register,
  GetRates,
  CreateLabel,
  VoidLabels,
  CreateManifest,
  SchedulePickup,
  CancelPickup,
  Track,
  ImportTrackingEvents,
} from './methods';
import { Metadata } from './definitions';

export default {
  Metadata,
  Register,
  GetRates,
  CreateLabel,
  VoidLabels,
  CreateManifest,
  SchedulePickup,
  CancelPickup,
  Track,
  ImportTrackingEvents
} satisfies CarrierAppDefinition;
