import type { Currency, NumericCurrency } from "@shipengine/connect-carrier-api";

/** Create add on 2, if applicable */
export const createAddOn2 = ({ adjustment }: { adjustment: number }, baseRate: NumericCurrency): Currency | undefined => {
  if (!adjustment || !baseRate.amount) {
    return undefined;
  }

  return { ...baseRate, amount: (baseRate.amount * adjustment).toFixed(2) };
};
