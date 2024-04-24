import { AnalyticsDriver } from '../interfaces/analytics-driver'
import { AnalyticsEvent, CustomAnalyticsEvent } from '../interfaces/analytics-event'

import {
  AddPaymentInfoConfig,
  AddShippingInfoConfig,
  AddToCartConfig,
  BeginCheckoutConfig,
  LoginConfig,
  PageViewConfig,
  PurchaseConfig,
  RemoveFromCartConfig,
  SignUpConfig,
  SubscribeConfig,
  UserDataConfig,
  ViewCartConfig,
  ViewItemConfig,
  ViewItemListConfig
} from '../interfaces/events/config'
import { CurrencyCode } from '../interfaces/trackify-globals';

export type SupportedEventData =
  PageViewConfig
  | AddPaymentInfoConfig
  | AddShippingInfoConfig
  | AddToCartConfig
  | BeginCheckoutConfig
  | PurchaseConfig
  | RemoveFromCartConfig
  | ViewCartConfig
  | ViewItemConfig
  | ViewItemListConfig
  | LoginConfig
  | SubscribeConfig
  | UserDataConfig
  | SignUpConfig;
export type SupportedEvent = AnalyticsEvent<SupportedEventData> | CustomAnalyticsEvent<unknown>;

export interface CeneoItem extends Record<string, unknown> {
  id: string;
  price: number;
  quantity?: number;
  currency?: keyof typeof CurrencyCode;
}

interface Transaction {
  client_email: string;
  order_id: string;
  shop_products: CeneoItem[];
  work_days_to_send_questionnaire: number;
  amount: number;
}

declare global {
  interface Window {
    _ceneo?<T>(eventType: string, eventData: T): void;
  }
}

export default class CeneoBrowserDriver implements AnalyticsDriver {

  public static SUPPORTED_EVENTS = [
    'page_view',
    'user_data_update',
    'subscribe',
    'unsubscribe',
    'add_payment_info',
    'add_to_cart',
    'purchase',
    'view_cart',
    'view_item',
    'view_item_list',
    'login',
    'sign_up'
  ]

  public static AVAILABILITY_CHECK_TIMEOUT = 250
  public static AVAILABILITY_CHECK_MAX_TIMEOUT = 1500
  public name = 'CeneoBrowserDriver'

  public async load (): Promise<boolean> {
    try {
      this.reportDebug('[Ceneo] Load')
      await this.checkIfLoaded()

      return true
    } catch (e) {
      return false
    }
  }

  protected reportDebug (_error: unknown): void {
    if (window && typeof console !== 'undefined' && console.debug) {
      console.debug(_error)
    }
  }

  public supportsEvent (event: AnalyticsEvent<unknown>): boolean {
    return CeneoBrowserDriver.SUPPORTED_EVENTS.includes(event.name)
  }

  public async track (event: AnalyticsEvent<unknown>): Promise<void> {
    this.reportDebug('[Ceneo] track')

    const data = event.getData()
    this.reportDebug('[Ceneo] track ' + event.name)

    switch (event.name) {
      case 'page_view':
        return await this.trackPageView(data as PageViewConfig)
      case 'add_payment_info':
        return await this.trackAddPaymentInfo(data as AddPaymentInfoConfig)
      case 'add_to_cart':
        return await this.trackAddToCart(data as AddToCartConfig)
      case 'purchase':
        return await this.trackPurchase(data as PurchaseConfig)
      case 'view_cart':
        return await this.trackViewCart(data as ViewCartConfig)
      case 'view_item':
        return await this.trackViewItem(data as ViewItemConfig)
      case 'view_item_list':
        return await this.trackViewItemList(data as ViewItemListConfig)
      case 'login':
        return await this.trackLogin(data as LoginConfig)
      case 'sign_up':
        return await this.trackSignUp(data as SignUpConfig)
      default:
        throw new TypeError(`Event ${event.name} not supported!`)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async trackPageView (_data: PageViewConfig): Promise<void> {
    //
  }

  protected checkIfLoaded (timeout = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window._ceneo) {
        resolve()
      } else if (timeout >= CeneoBrowserDriver.AVAILABILITY_CHECK_MAX_TIMEOUT) {
        reject()
      } else {
        setTimeout(() => {
          this.checkIfLoaded(timeout + CeneoBrowserDriver.AVAILABILITY_CHECK_TIMEOUT).then(() => resolve())
            .catch(() => reject())
        }, CeneoBrowserDriver.AVAILABILITY_CHECK_TIMEOUT)
      }
    })
  }

  protected monetaryValue (value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async trackLogin (_data: LoginConfig): Promise<void> {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async trackSignUp (_data: SignUpConfig): Promise<void> {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async trackAddPaymentInfo (_data: AddPaymentInfoConfig): Promise<void> {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async trackViewCart (_data: ViewCartConfig): Promise<void> {
    //
  }

  private async trackPurchase (data: PurchaseConfig): Promise<void> {
    if (window && window._ceneo && '_ceneo' in window) {
      window._ceneo<Transaction>('transaction', {
        client_email: '', // skip sending questionnaire
        order_id: data.transactionId,
        shop_products: data.items.map(item => {
          return {
            id: item.id,
            price: this.monetaryValue(item.price as number),
            quantity: item.quantity,
            currency: item.currency
          }
        }),
        work_days_to_send_questionnaire: 3,
        amount: this.monetaryValue(data.value)
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async trackAddToCart (_data: AddToCartConfig): Promise<void> {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async trackViewItem (_data: ViewItemConfig): Promise<void> {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async trackViewItemList (_data: ViewItemListConfig): Promise<void> {
    //
  }
}
