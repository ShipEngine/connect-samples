import {
  GetPackingSlipTemplateRequest,
  GetPackingSlipTemplateResponse,
  PackingSlipSize,
} from "@shipengine/connect-order-source-api";
import { readFileSync } from "fs";
import { join } from "path";
import { header } from './packing-slip-template'

const loadTemplate = (file: string): string => {
  const packingSlipsDirectory = "../../assets/packing-slips";
  return readFileSync(join(__dirname, packingSlipsDirectory, file), "utf-8");
};

export const GetPackingSlipTemplate = (
  request: GetPackingSlipTemplateRequest
): GetPackingSlipTemplateResponse => {
  const itemsHeader = loadTemplate("items-header.html");
  const item = loadTemplate("item.html");
  const footer = loadTemplate("footer.html");

  const styling =
    request.size === PackingSlipSize.Letter
      ? loadTemplate("styling/letter.html")
      : loadTemplate("styling/four-by-six.html");

    console.log(styling);

  return {
    packing_slip_template: {
      name: "Order Source Packing Slip ™",
      header: styling + header,
      items_header: itemsHeader,
      item: item,
      footer: footer,
    },
  };
};
