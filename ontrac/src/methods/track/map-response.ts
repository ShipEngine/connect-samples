import { TrackingResponse } from "@shipengine/connect-carrier-api";
import {
  StandardizedStatusCodes,
  TrackEvent,
} from "@shipengine/connect-carrier-api/lib/models";
import {
  OntracTrackingResponse,
  TrackingEvent,
  TrackingShipment,
} from "../../api";
const moment = require("moment");

const mapStatus = (status: string): StandardizedStatusCodes => {
  switch (status) {
    case "Pending":
      return StandardizedStatusCodes.Accepted;
    case "In Transit":
    case "Out for Delivery":
      return StandardizedStatusCodes.InTransit;
    case "Delivered":
      return StandardizedStatusCodes.Delivered;
    case "Discarded":
      return StandardizedStatusCodes.Exception;
    default:
      return StandardizedStatusCodes.Unknown;
  }
};

const mapEvent = (trackingEvent: TrackingEvent): TrackEvent => {
  return {
    event_datetime: new moment(trackingEvent.EventTime).toISOString(),
    status_code: mapStatus(trackingEvent.Description),
    event_code: trackingEvent.Status,
    description: trackingEvent.Description,
    state: trackingEvent.State,
    postal_code: trackingEvent.Zip,
    city: trackingEvent.City,
  };
};

const getAllEventsFromShipments = (
  shipments: TrackingShipment[]
): TrackEvent[] => {
  const ret: TrackEvent[] = [];
  shipments.forEach((shipment) => {
    ret.push(...shipment.Events.map(mapEvent));
  });
  return ret;
};
const getLatestEvent = (events: TrackEvent[]): TrackEvent | undefined => {
  if (!events) {
    return undefined;
  }
  return events.reduce((a, b) => {
    return new Date(a.event_datetime) > new Date(b.event_datetime) ? a : b;
  });
};

export const mapResponse = (
  response: OntracTrackingResponse
): TrackingResponse => {
  const events = getAllEventsFromShipments(response.Shipments);
  const latest = getLatestEvent(events);
  const shipment = response.Shipments[0];
  return {
    tracking_info: {
      tracking_number: shipment.Tracking,
      events,
      standardized_status_code: latest
        ? mapStatus(latest.status_code)
        : StandardizedStatusCodes.Unknown,
      service: {
        code: shipment.Service,
      },
      estimated_delivery_datetime: moment(shipment.Exp_Del_Date).toISOString(),
    },
  };
};
