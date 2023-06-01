import type {
  Rate,
  RatingContext,
  ShipmentAndId,
  RateResultsAndId,
  GetRatesResults,
  GetVariableResults,
  GetZoneResults,
} from "@shipengine/connect-carrier-api";
import { ConfirmationTypes } from "@shipengine/connect-carrier-api/lib/models/confirmation-types";
import { BillingCategories } from "@shipengine/connect-carrier-api/lib/models/billing/billing-categories";
import {
  addOnKey,
  availableZones,
  deliveryKey,
  weightCutoffs,
} from "./constants";
import { createAddOn2 } from "./helper";

interface ShipmentDetails {
  id: string;
  service: string;
  buildRateKey: (zone: string) => string;
  metadataKeys: string[];
  zoneKey: string;
}

interface ShipmentError {
  id: string;
  error: string;
}

/** Predicate that filters out ShipmentErrors
 * This is useful because it helps TypeScript know that after running items through this, all the items in an array will be ShipmentDetails
 */
const isValidDetails = (
  value: ShipmentDetails | ShipmentError
): value is ShipmentDetails => !("error" in value);

/** Get details necessary for rating each shipment */
const getShipmentDetails = ({
  id,
  shipment,
}: ShipmentAndId): ShipmentDetails | ShipmentError => {
  // Use the requested service, but default to 'ground'
  const service = shipment.service_code || "ground";

  // We need to get the list of packages, but if there are none we're going to consider that an error
  const boxes = shipment.packages || [];
  if (boxes.length === 0) {
    return { id, error: "Could not find any packages" };
  }

  // The sample carrier does not support multi-package shipments
  if (boxes.length > 1) {
    return { id, error: "Only single package shipments are supported" };
  }

  // The sample carrier uses weight brackets so we're going to get the lowest bracket into which this weight will fit.
  // Some carriers may elect to just round up to the nearest whole unit or use some other algorithm
  const weight = (boxes[0].weight_details.weight_in_ounces || 0) / 16;
  const foundWeight = weightCutoffs.find((x) => x >= weight);
  if (!foundWeight) {
    return { id, error: "Weight is greater than max allowed" };
  }

  // We're going to create a key per possible zone. This will let us get rate data and zone at the same time so that we
  // don't have to wait for the zone call to finish before making the call to get rate data. This optimization works well
  // when the total number of data keys is under 100. If it would cause the number of data keys to go above 100, it may
  // be faster to get the zone first and then build the keys based on the actual zone of the shipment.
  const buildRateKey = (zone: string) => `${service}-${zone}-${foundWeight}lb`;

  const metadataKeys = [addOnKey];

  return {
    id,
    service,
    buildRateKey,
    zoneKey: `${shipment.ship_from.postal_code[0]}-${shipment.ship_to.postal_code[0]}`,
    metadataKeys:
      shipment.confirmation === ConfirmationTypes.Delivery
        ? metadataKeys.concat(deliveryKey)
        : metadataKeys,
  };
};

/** Build rates for shipment based on the retrieved data */
const buildRates =
  (
    rates: GetRatesResults,
    metadata: GetVariableResults,
    zones: GetZoneResults
  ) =>
  (shipmentDetails: ShipmentDetails | ShipmentError): RateResultsAndId => {
    // Just return empty rates with an error attached if the shipment failed the key generation step
    if (!isValidDetails(shipmentDetails)) {
      return {
        id: shipmentDetails.id,
        rates: [],
        error: shipmentDetails.error,
      };
    }

    // First we need to find the zone for this shipment
    const zone = zones[shipmentDetails.zoneKey];

    // If we didn't find a zone, we're not going to find rates.  So just return an empty rate with an error attached.
    if (!zone) {
      return {
        id: shipmentDetails.id,
        rates: [],
        error: "Could not find zone",
      };
    }

    // Next we're going to get the actual key that should have been used for this shipment and try to get a rate from that
    const shipmentRateKey = shipmentDetails.buildRateKey(zone);
    const baseRate = rates[shipmentRateKey];

    const rateResult: Rate = {
      service_code: shipmentDetails.service,
      billing_line_items: [],
      zone,
    };

    if (baseRate && baseRate.amount) {
      rateResult.billing_line_items.push({
        amount: { ...baseRate, amount: baseRate.amount.toFixed(2) },
        billing_category: BillingCategories.Shipping,
        carrier_billing_code: "Base Rate",
      });

      // Try to get the add-on, which would apply to all rates
      const addOn2 = metadata[addOnKey];
      if (addOn2) {
        const addOn2Value = createAddOn2(addOn2, baseRate);
        if (addOn2Value) {
          rateResult.billing_line_items.push({
            carrier_billing_code: "Add-on 2",
            billing_category: BillingCategories.AdditionalFees,
            amount: addOn2Value,
          });
        }
      }

      const deliveryConfirmation = metadata[deliveryKey] as number;
      if (deliveryConfirmation) {
        rateResult.billing_line_items.push({
          carrier_billing_code: "Delivery Confirmation",
          billing_category: BillingCategories.Delivery,
          amount: { amount: deliveryConfirmation.toFixed(2), currency: "USD" },
        });
      }
    }

    // As an example, we're going to add a hard-coded rate to the data-driven one. It would probably be better to do something
    // like this using metadata like the the 'add-on 2' charge so that values could more easily change over time, but this is valid.
    const rateResults = [
      rateResult,
      {
        service_code: "Super Express",
        charges: [{ type: "Freight Charge", price: { amount: "99.99" } }],
      },
    ];

    return { id: shipmentDetails.id, rates: rateResults };
  };

/** Get rates for a batch of shipments
 * @param context Context for this request
 * @param shipment Shipment for which to get rates
 * @returns List of charges that apply to this shipment
 */
export default async function rateShipments(
  context: RatingContext,
  shipments: ShipmentAndId[]
): Promise<RateResultsAndId[]> {
  // Build up the data keys necessary to rate the shipments
  const shipmentServices = shipments.map(getShipmentDetails);
  const validShipmentService = shipmentServices.filter(isValidDetails);

  // Request all the data we'll need in parallel
  const [rates, metadata, zones] = await Promise.all([
    context.getRates(
      validShipmentService.flatMap((x) => availableZones.map(x.buildRateKey))
    ),
    context.getVariables(validShipmentService.flatMap((x) => x.metadataKeys)),
    context.getZone(validShipmentService.map((x) => x.zoneKey)),
  ]);

  // Use the data to actually build the rates for each shipment
  return shipmentServices.map(buildRates(rates, metadata, zones));
}
