import { CurrencyCode, PageType } from '../trackify-globals'
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
  eventId?: string
}

export interface AddShippingInfoConfig extends AnalyticsEventConfig {
  currency?: keyof typeof CurrencyCode,
  value: number,
  coupon?: string,
  shippingTier?: string,
  items: Array<Item>,
  eventId?: string
}

export interface AddToCartConfig extends AnalyticsEventConfig {
  currency?: keyof typeof CurrencyCode,
  value: number,
  items: Array<Item>
  eventId?: string
}

export interface BeginCheckoutConfig extends AnalyticsEventConfig {
  currency?: keyof typeof CurrencyCode,
  value: number,
  coupon?: string,
  items: Array<Item>
  eventId?: string
}

export interface CustomerConfig extends AnalyticsEventConfig {
  method?: string;
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
  eventId?: string
}

export interface LoginConfig extends AnalyticsEventConfig {
  method: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  id?: string;
  shop_id?: string; // shop_id when multisite
  user_id?: string; //sha256 from email
  client_id?: string; //user id from site
  eventId?: string
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
  eventId?: string
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
  eventId?: string
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
  user_id?: string; //sha256 from email
  client_id?: string; //user id from site
  eventId?: string
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
  customer?: CustomerConfig,
  event?: string, // TradeDoubler event ID
  organization?: string // TradeDoubler organization ID
  eventId?: string
}

export interface RemoveFromCartConfig extends AnalyticsEventConfig {
  currency?: keyof typeof CurrencyCode,
  value: number,
  items: Array<Item>
  eventId?: string
}

export interface ViewCartConfig extends AnalyticsEventConfig {
  currency?: keyof typeof CurrencyCode,
  value: number,
  totalQuantity: number,
  items: Array<Item>
  eventId?: string
}

export interface ViewItemConfig extends AnalyticsEventConfig {
  currency?: keyof typeof CurrencyCode,
  value: number,
  items: Array<Item>
  eventId?: string
}

export interface ViewItemListConfig extends AnalyticsEventConfig {
  listId: string,
  listName: string,
  items: Array<Item>
  eventId?: string
}

export interface PageViewConfig extends AnalyticsEventConfig {
  pagePath: string,
  pageTitle: string,
  pageType?: PageType,
  language?: string,
  currency?: keyof typeof CurrencyCode,
  turnOffPageViewForSPA?: number,
  customEventName?: string
  eventId?: string
}
