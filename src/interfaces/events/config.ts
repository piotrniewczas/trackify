import { CurrencyCode } from '../trackify-globals'
import { Item } from './item'
import { AnalyticsEventConfig } from '../analytics-event'

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

export interface CustomerConfig extends AnalyticsEventConfig {
  method: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  id?: string;
  gender?: string;
  birthDate?: string;
  province?: string;
  zipCode?: string;
  country?: string;
}

export interface LoginConfig extends AnalyticsEventConfig {
  method: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  id?: string;
  shop_id?: string;
}

export interface SubscribeConfig extends AnalyticsEventConfig {
  email: string;
  name?: string;
  list?: string;
  allow_marketing?: string;
  allow_sms_marketing?: string;
  allow_policy?: string;
  language?: string;
  storeCode?: string;
  source?: string;
}

export interface UserDataConfig extends AnalyticsEventConfig {
  firstname?: string;
  lastname?: string;
  email?: string;
  id?: string;
  shop_id?: string;
  dateOfBirth?: string;
  phone?: string;
  sex?: string;
  ip?: string;
  country?: string;
  city?: string;
  province?: string;
}

export interface SignUpConfig extends AnalyticsEventConfig {
  method: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  id?: string;
  shop_id?: string;
  allow_marketing?: string;
  allow_sms_marketing?: string;
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
  currency?: keyof typeof CurrencyCode,
  turnOffPageViewForSPA: number
}
