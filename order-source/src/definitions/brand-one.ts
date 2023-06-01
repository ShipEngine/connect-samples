import { ConnectionFormSchema } from './connection-form-schema';
import { join } from 'path';
import { OrderSourceDefinition, PackingSlipTemplateVersion } from '@shipengine/connect-order-source-api';

export const brandOne: OrderSourceDefinition = {
  Id: '3440a3bf-cd22-494f-ad02-500b6cdcedb8',
  Name: 'Brand One',
  SendEmail: true,
  CanRefresh: false,
  CanConfigureTimeZone: false,
  CanConfirmShipments: false,
  CanLeaveFeedback: true,
  HasCustomStatuses: false,
  HasInventoryLevels: true,
  AccountConnection: {
    Name: 'Brand One Connection',
    ConnectionFormSchema,
  },
  Images: {
    Logo: join(__dirname, '../../assets/brand-one/logo.svg'),
    Icon: join(__dirname, '../../assets/brand-one/icon.svg'),
  },
  SupportedPackingSlipTemplateVersions: [PackingSlipTemplateVersion.ShipStation],
  CustomFieldOptions: [{
    Field: "test",
    DisplayName: "Test Field"
  }, {
    Field: "hidden",
    DisplayName: "Hidden Field",
    IsAdmin: true
  }],
};
