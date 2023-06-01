import { CancelNotificationRequest, CancelNotificationResponse, CarrierAppDefinition } from '@shipengine/connect-carrier-api';
import {
  Register,
  GetRates,
  CreateLabel,
  VoidLabels,
  CreateManifest,
  SchedulePickup,
  CancelPickup,
  Track,
} from './methods';
import { Metadata } from './definitions';

export default {
  CancelNotification: (x: CancelNotificationRequest) => {
    return {} as unknown as CancelNotificationResponse;
  },
  Metadata,
  Register,
  GetRates,
  CreateLabel,
  VoidLabels,
  CreateManifest,
  SchedulePickup,
  CancelPickup,
  Track,
} satisfies CarrierAppDefinition;
