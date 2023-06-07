import { CreateLabelResponse } from "@shipengine/connect-carrier-api";
import { BillingCategories, DocumentFormat, DocumentType } from "@shipengine/connect-carrier-api/lib/models";
import { ExternalServerError } from "@shipengine/connect-runtime";
import { OnTrackShipmentResponse } from "../../api";
const moment = require('moment');

export const mapResponse = (
  response: OnTrackShipmentResponse,
  labelFormat: DocumentFormat,
  transactionId: string,
): CreateLabelResponse => {
  const shipment = response.Shipments[0];
  if (!shipment) {
    throw new Error("No Shipment returned");
  }
  if (shipment.Error) {
    throw new ExternalServerError(shipment.Error);
  }

  
  const ret: CreateLabelResponse = {
      tracking_number: shipment.TrackingNumber,
      billing_line_items: [
          {
              billing_category: BillingCategories.Delivery,
              amount: {
                  currency: "USD",
                  amount: (shipment.ServiceChrg || 0).toString(),
              },
          },
          {
              billing_category: BillingCategories.FuelCharge,
              amount: {
                  currency: "USD",
                  amount: (shipment.FuelChrg || 0).toString(),
              },
          },
      ],
      estimated_delivery_datetime: moment(shipment.ExpectedDeliveryDate, 'YYYYMMDD').toISOString(),
      documents: [
          {
              type: [DocumentType.Label],
              data: labelFormat === DocumentFormat.Pdf
                  ? shipment.Label
                  : Buffer.from(shipment.Label, "utf-8").toString('base64'),
              format: labelFormat,
          }
      ],
      transaction_id: transactionId,
      alternative_identifiers: [{
          type: 'UID',
          value: shipment.UID
      }]
  };
  return ret;
};
