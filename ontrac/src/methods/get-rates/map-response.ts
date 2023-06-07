import { GetRatesResponse } from "@shipengine/connect-carrier-api";
import {
  BillingCategories,
  BillingLineItem,
  Rate,
} from "@shipengine/connect-carrier-api/lib/models";
import { OntracRatesResponse, Rate as OntracRate } from "../../api";
const moment = require("moment");

const getBillingLineItem = (
  billing_category: BillingCategories,
  amount: number
): BillingLineItem => {
  return {
    billing_category,
    amount: {
      currency: "USD",
      amount: amount.toString(),
    },
  };
};
const mapBillingLineItems = (rate: OntracRate): BillingLineItem[] => {
  const ret: BillingLineItem[] = [];
  ret.push(getBillingLineItem(BillingCategories.Shipping, rate.TotalCharge));
  return ret;
};

const mapRates = (rate: OntracRate): Rate | undefined => {
  if (isNaN(rate.TotalCharge)) {
    return undefined;
  }
  if (rate.TotalCharge === 0) {
    return undefined;
  }
  const ret: Rate = {
    service_code: rate.Service,
    estimated_delivery_datetime: moment(
      rate.ExpectedDeliveryDate,
      "YYYYMMDD"
    ).toISOString(),
    billing_line_items: mapBillingLineItems(rate),
  };
  return ret;
};

export const mapResponse = (
  response: OntracRatesResponse
): GetRatesResponse => {
  const rates = response?.Shipments[0]?.Rates;
  if (!rates) {
    return {
      rates: [],
    };
  }
  return {
    rates: rates.map(mapRates).filter((rate) => rate !== undefined),
  };
};
