import {
  OntracTrackingResponse,
  TrackingShipment,
  TrackingEvent,
  ServiceCode,
} from "./models";
const axios = require("axios");
import { parseStringPromise } from "xml2js";
import { ExternalServerError } from "@shipengine/connect-runtime";
import { BASE_URL } from "./constants";

const getTrackUrl = (request: OntracTrackingRequest): string => {
  let data = `${BASE_URL}/${request.accountNumber}/shipments?`;
  data += `pw=${request.password}`;
  data += `&tn=${request.trackingNumber}&requestType=track`;
  return data;
};

export class OntracTrackingRequest {
  useSandbox: boolean;
  accountNumber: string;
  password: string;
  trackingNumber: string;
}

const normalizeData = (data): OntracTrackingResponse => {
  const result = JSON.parse(JSON.stringify(data.OnTracTrackingResult));
  const shipments = JSON.parse(
    JSON.stringify(data?.OnTracTrackingResult?.Shipments?.Shipment || [])
  );
  if (Array.isArray(shipments)) {
    result.Shipments = shipments;
  } else {
    result.Shipments = [shipments];
  }
  result?.Shipments?.forEach((shipment) => {
    const trackingEvents = JSON.parse(
      JSON.stringify(shipment.Events.Event || [])
    );
    if (Array.isArray(trackingEvents)) {
      shipment.Events = trackingEvents;
    } else {
      shipment.Events = [trackingEvents];
    }
  });
  return result;
};

const mapEvents = (trackingEvent): TrackingEvent => {
  const mappedEvent = {
    Status: trackingEvent?.Status,
    Description: trackingEvent?.Description,
    EventTime: `${trackingEvent?.EventTime}`,
    Facility: trackingEvent?.Facility,
    City: trackingEvent?.City,
    State: trackingEvent?.State,
    Zip: trackingEvent?.Zip,
  };
  return mappedEvent;
};

const mapShipments = (shipment): TrackingShipment => {
  return {
    Tracking: shipment?.Tracking,
    Exp_Del_Date: shipment?.Exp_Del_Date,
    Name: shipment?.Name,
    ShipDate: shipment?.ShipDate,
    Delivered: shipment?.Delivered,
    Contact: shipment?.Contact,
    Addr1: shipment?.Addr1,
    Addr2: shipment?.Addr2,
    Addr3: shipment?.Addr3,
    City: shipment?.City,
    State: shipment?.State,
    Zip: shipment?.Zip,
    Service: shipment?.Service as ServiceCode,
    POD: shipment?.POD,
    Error: shipment?.Error,
    Reference: shipment?.Reference,
    Reference2: shipment?.Reference2,
    Reference3: shipment?.Reference3,
    ServiceCharge: shipment?.ServiceCharge,
    FuelCharge: shipment?.FuelCharge,
    TotalChrg: shipment?.TotalChrg,
    Residential: shipment?.Residential,
    Weight: shipment?.Weight,
    Signature: shipment?.Signature,
    Events: shipment?.Events.map(mapEvents),
  };
};

const mapParsedXmlToResponse = (data: any): OntracTrackingResponse => {
  const response: OntracTrackingResponse = {
    Error: data.Error,
    Note: data.Note,
    Shipments: data.Shipments?.map(mapShipments),
  };
  return response;
};

const checkForErrors = (response: OntracTrackingResponse) => {
  const isEmpty = (str: string) => {
    return !str || str.length === 0;
  };
  if (!isEmpty(response.Error)) {
    throw new ExternalServerError(response.Error);
  }
  (response.Shipments || []).forEach((shipment) => {
    if (!isEmpty(shipment.Error)) {
      throw new ExternalServerError(shipment.Error);
    }
  });
};

export const track = async (
  request: OntracTrackingRequest
): Promise<OntracTrackingResponse> => {
  const trackUrl = getTrackUrl(request);
  const response = await axios.get(trackUrl);
  const data = await parseStringPromise(response.data, {
    explicitArray: false,
  });
  const normalizedData = normalizeData(data);
  checkForErrors(normalizedData);
  const mappedResponse = mapParsedXmlToResponse(normalizedData);
  return mappedResponse;
};
