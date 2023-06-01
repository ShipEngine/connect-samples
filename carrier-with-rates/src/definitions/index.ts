import { CarrierAppMetadata } from '@shipengine/connect-carrier-api';

import { DemoCarrier } from './demo-carrier';

export const Metadata: CarrierAppMetadata = {
  // DO NOT CHANGE THIS ID AFTER PUBLISHING
  Id: 'e1c0ef7f-0ac3-4b75-96ca-e224022b942f',
  Name: 'Carrier API With Rates',
  Carriers: [DemoCarrier],
};
