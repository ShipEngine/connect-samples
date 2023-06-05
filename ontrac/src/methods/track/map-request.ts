import { TrackingRequest } from "@shipengine/connect-carrier-api";
import { BadRequestError } from "@shipengine/connect-runtime";
import { OntracTrackingRequest } from "../../api";
import { RegistrationData } from "../../definitions/forms";

export const mapRequest = (request: TrackingRequest): OntracTrackingRequest => {
  const { accountnumber, password } = request.metadata as RegistrationData;
  const trackingNumber = request.identifiers?.find(p => p.type === 'tracking_number');
  if(!trackingNumber) {
      throw new BadRequestError(`Unable to find tracking_number in identifiers: ${JSON.stringify(request.identifiers)}`);
  }
  return {
    accountNumber: accountnumber,
    password,
    useSandbox: false,
    trackingNumber: trackingNumber.value
  };
};
