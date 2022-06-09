import {CurrencyCode} from "../trackify-globals";
import {Item} from "./item";
import {AnalyticsEventConfig} from "../analytics-event";

export interface AddPaymentInfoConfig extends AnalyticsEventConfig {
  currency?: keyof typeof CurrencyCode,
  value: number,
  coupon?: string,
  paymentMethod?: string,
  items: Array<Item>,
  customer?: {
    firstname?: string;
    lastname?: string;
    email?: string;
    telephone?: string;
  }
}

export interface AddShippingInfoConfig extends AnalyticsEventConfig {
  currency?: keyof typeof CurrencyCode,
  value: number,
  coupon?: string,
  shippingTier?: string,
  items: Array<Item>,
}

export interface AddToCartConfig extends AnalyticsEventConfig {
  currency?: keyof typeof CurrencyCode,
  value: number,
  items: Array<Item>
}

export interface BeginCheckoutConfig extends AnalyticsEventConfig {
  currency?: keyof typeof CurrencyCode,
  value: number,
  coupon?: string,
  items: Array<Item>
}

export interface LoginConfig extends AnalyticsEventConfig {
  method: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  id?: string;
  shop_id?: string;
}

export interface PurchaseConfig extends AnalyticsEventConfig {
  currency?: keyof typeof CurrencyCode,
  transactionId: string,
  value: number,
  affiliation?: string,
  coupon?: string,
  shipping?: number,
  tax?: number,
  items: Array<Item>,
  discount?: number,
  customer?: {
    id?: string | number,
  }
}

export interface RemoveFromCartConfig extends AnalyticsEventConfig {
  currency?: keyof typeof CurrencyCode,
  value: number,
  items: Array<Item>
}

export interface SignUpConfig extends AnalyticsEventConfig {
  method: string
}

export interface ViewCartConfig extends AnalyticsEventConfig {
  currency?: keyof typeof CurrencyCode,
  value: number,
  items: Array<Item>
}

export interface ViewItemConfig extends AnalyticsEventConfig {
  currency?: keyof typeof CurrencyCode,
  value: number,
  items: Array<Item>
}

export interface ViewItemListConfig extends AnalyticsEventConfig {
  listId: string,
  listName: string,
  items: Array<Item>
}

export interface PageViewConfig extends AnalyticsEventConfig {
  pagePath: string,
  pageTitle: string,
  language?: string,
  currency?: keyof typeof CurrencyCode
}
