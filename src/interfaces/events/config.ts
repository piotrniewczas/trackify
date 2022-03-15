import {CurrencyCode} from "../trackify-globals";
import {Item} from "./item";
import {AnalyticsEventConfig} from "../analytics-event";

export interface AddPaymentInfoConfig extends AnalyticsEventConfig {
  currency?: CurrencyCode,
  value: number,
  coupon?: string,
  paymentMethod?: string,
  items: Array<Item>
}

export interface AddShippingInfoConfig extends AnalyticsEventConfig {
  currency?: CurrencyCode,
  value: number,
  coupon?: string,
  shippingTier?: string,
  items: Array<Item>
}

export interface AddToCartConfig extends AnalyticsEventConfig {
  currency?: CurrencyCode,
  value: number,
  items: Array<Item>
}

export interface BeginCheckoutConfig extends AnalyticsEventConfig {
  currency?: CurrencyCode,
  value: number,
  coupon?: string,
  items: Array<Item>
}

export interface LoginConfig extends AnalyticsEventConfig {
  method: string
}

export interface PurchaseConfig extends AnalyticsEventConfig {
  currency?: CurrencyCode,
  transactionId: string,
  value: number,
  affiliation?: string,
  coupon?: string,
  shipping?: number,
  tax?: number,
  items: Array<Item>
}

export interface RemoveFromCartConfig extends AnalyticsEventConfig {
  currency?: CurrencyCode,
  value: number,
  items: Array<Item>
}

export interface SignUpConfig extends AnalyticsEventConfig {
  method: string
}

export interface ViewCartConfig extends AnalyticsEventConfig {
  currency?: CurrencyCode,
  value: number,
  items: Array<Item>
}

export interface ViewItemConfig extends AnalyticsEventConfig {
  currency?: CurrencyCode,
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
  currency?: CurrencyCode
}
