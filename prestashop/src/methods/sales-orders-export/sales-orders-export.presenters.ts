import {
  Address,
  NoteType,
  RequestedFulfillment,
  SalesOrder,
  SalesOrderExportCriteria,
  SalesOrderStatus,
  SalesOrdersExportRequest,
  SalesOrdersExportResponse,
} from '@shipengine/connect-order-source-api';
import { SalesOrderCustomStatusMappings } from '@shipengine/connect-order-source-api/lib/requests/sales-orders-export-request';
import { SalesOrderItem } from '@shipengine/connect-order-source-api/lib/models/sales-order-item';
import * as currency from 'currency.js';
import {
  FilterEntry,
  GetOrderRequest,
  GetOrderResponse,
  GetOrdersRequest,
} from '../../client/client.models';
import {
  isoToDateString,
  prestashopDateToIsoDate,
} from '../common/transformers';
import {
  Order,
  OrderCarrierDetail,
  OrderRow,
  OrderState,
  Address as PsAddress,
} from '../../client/resources';
import { FILTER_NAME } from '../common/filters';

const ORDER_LOAD_LIMIT = Number.parseInt(process.env.PS_ORDER_LOAD_LIMIT || '100');
const DATE_YEARS_DELTA = 10;

enum ChargeDescription {
  ProductTaxes = 'Product taxes',
  ProductDiscount = 'Product discount'
}

const DEFAULT_ORDER_STATUS_MAPPING: Record<OrderState, SalesOrderStatus> = {
  [OrderState.AwaitingCheckPayment]: SalesOrderStatus.AwaitingPayment,
  [OrderState.PaymentAccepted]: SalesOrderStatus.AwaitingShipment,
  [OrderState.ProcessingInProgress]: SalesOrderStatus.AwaitingShipment,
  [OrderState.Shipped]: SalesOrderStatus.Completed,
  [OrderState.Delivered]: SalesOrderStatus.Completed,
  [OrderState.Canceled]: SalesOrderStatus.Cancelled,
  [OrderState.Refunded]: SalesOrderStatus.Cancelled,
  [OrderState.PaymentError]: SalesOrderStatus.AwaitingPayment,
  [OrderState.OnBackorderPaid]: SalesOrderStatus.OnHold,
  [OrderState.AwaitingBankWirePayment]: SalesOrderStatus.AwaitingPayment,
  [OrderState.RemotePaymentAccepted]: SalesOrderStatus.AwaitingShipment,
  [OrderState.OnBackorderNotPaid]: SalesOrderStatus.OnHold,
  [OrderState.AwaitingCashOnDeliveryValidation]: SalesOrderStatus.AwaitingPayment,
  [OrderState.WaitingForPayPalPayment]: SalesOrderStatus.AwaitingPayment,
  [OrderState.WaitingForCreditCardPayment]: SalesOrderStatus.AwaitingPayment,
  [OrderState.WaitingForLocalPaymentMethodPayment]: SalesOrderStatus.AwaitingPayment,
  [OrderState.AuthorizedToBeCapturedByMerchant]: SalesOrderStatus.PendingFulfillment,
  [OrderState.PartialRefund]: SalesOrderStatus.Cancelled,
  [OrderState.WaitingCapture]: SalesOrderStatus.AwaitingShipment,
  [OrderState.ShippingInProgress]: SalesOrderStatus.AwaitingShipment,
  [OrderState.HandledByCarrier]: SalesOrderStatus.AwaitingShipment,
  [OrderState.TechnicalError]: SalesOrderStatus.OnHold,
};

function getFutureIsoDate(isoDate: string): string {
  const sourceDate = new Date(isoDate);
  return new Date(
    sourceDate.getFullYear() + DATE_YEARS_DELTA,
    sourceDate.getMonth(),
    sourceDate.getDate(),
  ).toISOString();
}

function getFilters(criteria: SalesOrderExportCriteria): FilterEntry[] {
  const filters: FilterEntry[] = [];
  if (criteria?.from_date_time) {
    const fromDate = isoToDateString(criteria.from_date_time);
    // PrestaShop doesn't allow to pass conditions,
    // so we set future date to get orders starting form the date
    const toDate = isoToDateString(criteria.to_date_time || getFutureIsoDate(criteria.from_date_time));
    filters.push({
      name: FILTER_NAME.FilterDateAdd,
      value: `[${fromDate},${toDate}]`,
    });
    // this param allows to filter orders by "date_add" field
    filters.push({
      name: 'date',
      value: '1',
    });
  }

  return filters;
}

function getNextCursor(cursor: string, res: GetOrderResponse[]): string {
  if (res.length < ORDER_LOAD_LIMIT) {
    return null;
  }

  const currentPage = Number.parseInt(cursor) || 0;
  return `${currentPage + 1}`;
}

function toAddress(address: PsAddress): Address {
  return {
    name: `${address.firstname} ${address.lastname}`,
    phone: address.phone_mobile || address.phone,
    company: address.company,
    address_line_1: address.address1,
    address_line_2: address.address2,
    city: address.city,
    postal_code: address.postcode,
    country_code: address.country.iso_code,
  };
}

function orderCarrierDetailToAddress(detail: OrderCarrierDetail): Address {
  return {
    address_line_1: detail.locationAddress.address1,
    address_line_2: detail.locationAddress.address2,
    address_line_3: detail.locationAddress.address3,
    postal_code: detail.locationAddress.zipCode,
    city: detail.locationAddress.city,
    country_code: detail.locationAddress.countryIso,
    company: detail.locationAddress.companyName,
    pickup_location: {
      carrier_id: detail.carrierId.toString(),
      relay_id: detail.locationId.toString(),
    },
  };
}

function toSalesOrderItem(or: OrderRow): SalesOrderItem {
  const productTax = currency(or.unit_price_tax_incl - or.unit_price_tax_excl);

  return {
    description: or.product_name,
    quantity: or.product_quantity,
    unit_price: or.unit_price_tax_excl,
    taxes: [
      productTax.value && {
        amount: productTax.multiply(or.product_quantity).value,
        description: ChargeDescription.ProductTaxes,
      },
    ].filter(Boolean),
    product: {
      product_id: or.product_id,
      name: or.product_name,
      unit_cost: or.unit_price_tax_excl,
      identifiers: {
        isbn: or.product_isbn,
        upc: or.product_upc,
      },
    },
  };
}

function toSalesOrderStatus(status: OrderState, mapping: SalesOrderCustomStatusMappings): SalesOrderStatus {
  if (mapping && Object.keys(mapping).length) {
    return mapping[status];
  }
  return DEFAULT_ORDER_STATUS_MAPPING[status];
}

function getRequestedFulfillments(order: Order): RequestedFulfillment[] {
  return [
    {
      ship_to: order.order_carrier_detail?.isPickup
        ? orderCarrierDetailToAddress(order.order_carrier_detail)
        : toAddress(order.address_delivery),
      items: order.associations?.order_rows
        ? order.associations.order_rows.map(toSalesOrderItem)
        : [],
    },
  ];
}

function toSalesOrder(order: Order, reqMapping: SalesOrderCustomStatusMappings): SalesOrder {
  return {
    order_id: order.id.toString(),
    currency: order.currency,
    order_number: order.id.toString(),
    payment: {
      amount_paid: currency(order.total_paid).value,
      adjustments: [
        -order.total_discounts && {
          amount: -currency(order.total_discounts).value,
          description: ChargeDescription.ProductDiscount,
        },
      ].filter(Boolean),
    },
    status: toSalesOrderStatus(order.current_state, reqMapping),
    paid_date: prestashopDateToIsoDate(order.invoice_date),
    fulfilled_date: prestashopDateToIsoDate(order.date_add),
    notes: [order.gift_message && { type: NoteType.GiftMessage, text: order.gift_message }].filter(Boolean),
    modified_date_time: prestashopDateToIsoDate(order.date_upd),
    requested_fulfillments: getRequestedFulfillments(order),
    bill_to: toAddress(order.address_invoice),
    buyer: {
      buyer_id: order.id_customer,
      email: order.email,
      name: `${order.address_invoice.firstname} ${order.address_invoice.lastname}`,
      phone: order.address_invoice.phone_mobile || order.address_invoice.phone,
    },
  };
}

export function presentGetOrdersRequest(req: SalesOrdersExportRequest): GetOrdersRequest {
  const { auth, cursor } = req;
  const currentPage = Number.parseInt(cursor) || 0;
  return {
    key: auth.api_key,
    limit: {
      index: ORDER_LOAD_LIMIT * currentPage,
      limit: ORDER_LOAD_LIMIT,
    },
    filter: getFilters(req.criteria),
  };
}

export function presentGetOrderRequest(req: SalesOrdersExportRequest, orderId: number): GetOrderRequest {
  return {
    key: req.auth.api_key,
    order_id: orderId,
  };
}

export function presentSalesOrdersExportResponse(
  req: SalesOrdersExportRequest, res: GetOrderResponse[],
): SalesOrdersExportResponse {
  return {
    sales_orders: res.map(r => toSalesOrder(r.order, req.sales_order_status_mappings)),
    cursor: getNextCursor(req.cursor, res),
  };
}
