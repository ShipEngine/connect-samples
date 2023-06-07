import { CreateLabelRequest } from "@shipengine/connect-carrier-api";
import {
  AddressResidentialIndicator,
  ConfirmationTypes,
  DocumentFormat,
  ShipFrom,
  ShipTo,
} from "@shipengine/connect-carrier-api/lib/models";
import { BadRequestError } from "@shipengine/connect-runtime";
import {
  Address,
  CODType,
  CreateShipmentRequest,
  LabelType,
  OnTracShipmentRequest,
  ServiceCode,
} from "../../api";
import { RegistrationData } from "../../definitions/forms";
import { ouncesToPounds, toFixedNumber } from "../shared";
const moment = require("moment");

const mapAddress = (address: ShipFrom | ShipTo): Address => {
  return {
    Name: address?.company_name || address?.name || "",
    Contact: address?.company_name || address?.name || "",
    Addr1: address?.address_lines[0] || "",
    City: address?.city_locality || "",
    State: address?.state_province || "",
    Zip: address?.postal_code?.substr(0, 5) || "",
    Phone: address?.phone_number || "",
  };
};

const mapLabelFormat = (format: DocumentFormat): LabelType => {
  switch (format) {
    case DocumentFormat.Pdf:
      return LabelType.CROPPED_PDF;
    case DocumentFormat.Zpl:
      return LabelType.ZPL;
    default:
      throw new BadRequestError('Ontrac only supports PDF and ZPL label formats.');
  }
};

const mapOnTracShipmentRequest = (
  request: CreateLabelRequest
): OnTracShipmentRequest => {
  const { accountnumber } = request.metadata as RegistrationData;
  const pckg = request.packages[0];
  return {
    OnTracShipmentRequest: {
      Shipments: [
        {
          Shipment: {
            UID: request.transaction_id || "",
            Service: request.service_code as ServiceCode,
            shipper: mapAddress(request.ship_from),
            consignee: mapAddress(request.ship_to),
            DelEmail: "",
            Tracking: "",
            COD: 0.0,
            ShipEmail: "",
            ShipDate: moment(request.ship_datetime).format("YYYY-MM-DD"),
            Residential:
              request.ship_to.address_residential_indicator ===
              AddressResidentialIndicator.Yes,
            SignatureRequired:
              request.confirmation === ConfirmationTypes.Signature,
            SaturdayDel: request.advanced_options.saturday_delivery === true,
            Declared: Number(pckg.insured_value || "0"),
            CODType: CODType.None,
            Weight: ouncesToPounds(
              Number(pckg.weight_details.weight_in_ounces || "0")
            ),
            BillTo: Number(accountnumber || "0"),
            Instructions: pckg.label_messages?.reference1 || "",
            Reference: pckg.label_messages?.reference1 || "",
            Reference2: pckg.label_messages?.reference2 || "",
            Reference3: pckg.label_messages?.reference3 || "",
            DIM: {
              Length: toFixedNumber(
                pckg.dimension_details?.dimensions_in_inches?.length,
                2
              ),
              Width: toFixedNumber(
                pckg.dimension_details?.dimensions_in_inches?.width,
                2
              ),
              Height: toFixedNumber(
                pckg.dimension_details?.dimensions_in_inches?.height,
                2
              ),
            },
            LabelType: mapLabelFormat(request.label_format),
          },
        },
      ],
    },
  };
};

export const mapRequest = (
  request: CreateLabelRequest
): CreateShipmentRequest => {
  const { accountnumber, password } = request.metadata as RegistrationData;
  return {
    accountNumber: accountnumber,
    password: password,
    request: mapOnTracShipmentRequest(request),
  };
};
