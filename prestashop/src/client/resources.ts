export type DateString = string; // "YYYY-MM-DD HH:mm:ss"

export type PsBoolean = 0 | 1;

export interface Value {
  id: string;
  value: string;
}

export interface Country {
  id: string;
  id_zone: string;
  id_currency: string;
  iso_code: string;
  contains_states: boolean;
  need_zip_code: boolean;
  zip_code_format: string;
  name: Value[];
}

export interface Address {
  id: string;
  id_customer: string;
  id_manufacturer: string;
  id_supplier: string;
  id_warehouse: string;
  id_country: string;
  country: Country;
  id_state: string;

  alias: string;
  company: string;
  lastname: string;
  firstname: string;
  vat_number: string;
  address1: string;
  address2: string;
  postcode: string;
  city: string;
  other: string;
  phone: string;
  phone_mobile: string;
  dni: string;
  deleted: boolean;
  date_add: DateString;
  date_upd: DateString;
}

export interface LocationAddress {
  companyName: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  zipCode: string;
  country: string;
  countryIso: string;
}

export interface OrderCarrierDetail {
  orderId: number;
  orderReference: string;
  carrierId: number;
  carrierName: string;
  carrierModule: string;
  locationId: number;
  isPickup: PsBoolean;
  locationAddress: LocationAddress;
}

export interface OrderRow {
  id: string;
  product_id: string;
  product_attribute_id: string;
  product_quantity: number;
  product_name: string;
  product_reference: string;
  product_ean13: string;
  product_isbn: string;
  product_upc: string;
  product_price: number;
  id_customization: string;
  unit_price_tax_incl?: number;
  unit_price_tax_excl?: number;
}

export enum OrderState {
  AwaitingCheckPayment = '1',
  PaymentAccepted = '2',
  ProcessingInProgress = '3',
  Shipped = '4',
  Delivered = '5',
  Canceled = '6',
  Refunded = '7',
  PaymentError = '8',
  OnBackorderPaid = '9',
  AwaitingBankWirePayment = '10',
  RemotePaymentAccepted = '11',
  OnBackorderNotPaid = '12',
  AwaitingCashOnDeliveryValidation = '13',
  WaitingForPayPalPayment = '14',
  WaitingForCreditCardPayment = '15',
  WaitingForLocalPaymentMethodPayment = '16',
  AuthorizedToBeCapturedByMerchant = '17',
  PartialRefund = '18',
  WaitingCapture = '19',
  ShippingInProgress = '20',
  HandledByCarrier = '21',
  TechnicalError = '22',
}

export interface OrderId {
  id: number;
}

export interface Order {
  id: number;
  id_address_delivery: string;
  address_delivery: Address;
  id_address_invoice: string;
  address_invoice: Address;
  id_cart: string;
  id_currency: string;
  id_lang: string;
  id_customer: string;
  id_carrier: string;
  order_carrier_detail?: OrderCarrierDetail;
  email: string;
  currency?: string;

  current_state?: OrderState;
  module: string;
  invoice_number?: string;
  invoice_date?: DateString;
  delivery_number?: string;
  delivery_date?: DateString;
  valid?: boolean;
  date_add?: DateString;
  date_upd?: DateString;
  shipping_number?: string;
  note?: string;
  id_shop_group?: string;
  id_shop?: string;
  secure_key?: string;
  payment: string;
  recyclable?: boolean;
  gift?: boolean;
  gift_message?: string;
  mobile_theme?: boolean;
  total_discounts?: number;
  total_discounts_tax_incl?: number;
  total_discounts_tax_excl?: number;
  total_paid: number;
  total_paid_tax_incl?: number;
  total_paid_tax_excl?: number;
  total_paid_real: number;
  total_products: number;
  total_products_wt: number;
  total_shipping?: number;
  total_shipping_tax_incl?: number;
  total_shipping_tax_excl?: number;
  carrier_tax_rate?: number;
  total_wrapping?: number;
  total_wrapping_tax_incl?: number;
  total_wrapping_tax_excl?: number;
  round_mode?: number;
  round_type?: number;
  conversion_rate: number;
  reference: string;
  associations: {
    order_rows: OrderRow[];
  };
}

export interface Group {
  id: string;
}

export interface Customer {
  id: string;
  id_default_group?: string;
  id_lang?: string;
  newsletter_date_add?: DateString;
  ip_registration_newsletter?: string;
  last_passwd_gen?: DateString;
  secure_key?: string;
  deleted?: boolean;
  passwd: string;
  lastname: string;
  firstname: string;
  email: string;
  id_gende?: string;
  birthday?: string;
  newsletter?: boolean;
  optin?: boolean;
  website?: string;
  company?: string;
  siret?: string;
  ape?: string;
  outstanding_allow_amount?: number;
  show_public_prices?: boolean;
  id_risk?: number;
  max_payment_days?: number;
  active?: boolean;
  note?: string;
  is_guest?: boolean;
  id_shop?: string;
  id_shop_group?: string;
  date_add?: DateString;
  date_upd?: DateString;
  reset_password_token?: string;
  reset_password_validity?: DateString;
  associations?: {
      groups: Group[];
  };
}
