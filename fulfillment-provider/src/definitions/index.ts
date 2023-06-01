import { AuthenticationType, FulfillmentProviderAppMetadata } from "@shipengine/connect-fulfillment-provider-api";
import { brandOne } from "./brand-one";
import { brandTwo } from "./brand-two";

export const metadata: FulfillmentProviderAppMetadata = {
  Id: "3bdd999b-ecf5-4915-b505-c8e665ce1f56",
  Name: "Order Source API App",
  AuthProcess: {
    Identifier: {
      AuthenticationType: AuthenticationType.Basic
    }
  },
  FulfillmentProviders: [brandOne, brandTwo],
};
