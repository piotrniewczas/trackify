import { AnalyticsDriver } from '../interfaces/analytics-driver'
import { AnalyticsEvent, CustomAnalyticsEvent } from '../interfaces/analytics-event'
import { CurrencyCode } from '../interfaces/trackify-globals'
import { isCustomEvent } from '../helpers/fns'
import {
  AddPaymentInfoConfig,
  AddToCartConfig,
  LoginConfig,
  PageViewConfig,
  PurchaseConfig, SignUpConfig, UserDataConfig,
  ViewItemConfig, ViewItemListConfig
} from '../interfaces/events/config'

declare global {
  interface Window {
    UE?: { pageHit (config: Record<string, string>): void };
    userengage?: (
      eventName: string,
      payload?: Record<string, string | number | keyof typeof CurrencyCode | boolean | null | undefined>
    ) => void;
  }
}

export default class UsercomBrowserDriver implements AnalyticsDriver {
  public static SUPPORTED_EVENTS = [
    'page_view',
    'add_payment_info',
    'add_to_cart',
    'purchase',
    'view_item',
    'view_item_list',
    'login'
  ]
  public static AVAILABILITY_CHECK_TIMEOUT = 250
  public static AVAILABILITY_CHECK_MAX_TIMEOUT = 1500
  protected name = 'UsercomBrowserDriver'

  public async load (): Promise<boolean> {
    try {
      await this.checkIfUsercomLoaded()

      return true
    } catch (e) {
      return false
    }
  }

  public supportsEvent (event: AnalyticsEvent<unknown>): boolean {
    return UsercomBrowserDriver.SUPPORTED_EVENTS.includes(event.name)
  }

  public async track (event: AnalyticsEvent<unknown>): Promise<void> {
    if (isCustomEvent(event)) {
      return await this.trackCustom(event)
    }

    const data = event.getData()

    switch (event.name) {
      case 'page_view':
        return await this.trackPageView(data as PageViewConfig)
      case 'add_payment_info':
        return await this.trackAddPaymentInfo(data as AddPaymentInfoConfig)
      case 'add_to_cart':
        return await this.trackAddToCart(data as AddToCartConfig)
      case 'purchase':
        return await this.trackPurchase(data as PurchaseConfig)
      case 'view_item':
        return await this.trackViewItem(data as ViewItemConfig)
      case 'user_data_update':
        return await this.updateUserData(data as UserDataConfig)
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

  protected async trackPageView (data: PageViewConfig): Promise<void> {
    if (window.UE) {
      window.UE.pageHit({
        URL: data.pagePath
      })
    }

    this.push('event.page_view', {
      URL: data.pagePath
    })
  }

  protected async trackCustom (event: CustomAnalyticsEvent<unknown>): Promise<void> {
    const data = event.forDriver(this.name)
    if (data === null) {
      return
    }

    if (typeof data.event_name !== 'string') {
      throw new TypeError(`Custom event ${event.name} has to provide event name for ${this.name} [forDriver.event_name]`)
    }

    if (data.event_payload && typeof data.event_payload !== 'object') {
      throw new TypeError(`Custom event ${event.name} has to provide event payload for ${this.name} [forDriver.event_payload]`)
    }

    return this.push(
      data.event_name,
      data.event_payload as Record<string, string | number | undefined | keyof typeof CurrencyCode>
    )
  }

  protected push (
    eventName: string,
    payload?: Record<string, string | number | keyof typeof CurrencyCode | undefined>
  ): void {
    if (window.userengage) {
      window.userengage(eventName, payload)
    }
  }

  protected checkIfUsercomLoaded (timeout = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.userengage && window.UE) {
        resolve()
      } else if (timeout >= UsercomBrowserDriver.AVAILABILITY_CHECK_MAX_TIMEOUT) {
        reject()
      } else {
        setTimeout(() => {
          this.checkIfUsercomLoaded(timeout + UsercomBrowserDriver.AVAILABILITY_CHECK_TIMEOUT).then(() => resolve())
            .catch(() => reject())
        }, UsercomBrowserDriver.AVAILABILITY_CHECK_TIMEOUT)
      }
    })
  }

  protected monetaryValue (value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100
  }

  private async trackLogin (data: LoginConfig): Promise<void> {
    this.push('event.sign_in', { method: data.method })
  }

  private async trackSignUp (data: SignUpConfig): Promise<void> {
    this.push('event.sign_in')
    this.push('client.update', {
      'First name': data.firstname,
      'Last name': data.lastname,
      email: data.email,
      shop_user_id: data.id,
      store_id: data.shop_id
    })
  }

  private async updateUserData (data: UserDataConfig): Promise<void> {
    this.push('client.update', {
      'First name': data.firstname,
      'Last name': data.lastname,
      email: data.email,
      shop_user_id: data.id,
      store_id: data.shop_id
    })
  }

  private async trackAddPaymentInfo (data: AddPaymentInfoConfig): Promise<void> {
    this.push('event.checkout-data-step')
    this.push('client.update', {
      'First name': data.customer?.firstname,
      'Last name': data.customer?.lastname,
      email: data.customer?.email,
      phone_number: data.customer?.telephone
    })
  }

  private async trackPurchase (data: PurchaseConfig): Promise<void> {
    this.push('event.purchase', {
      user_id: data.customer?.id,
      order_id: data.transactionId,
      total: data.value ? this.monetaryValue(data.value) : undefined,
      value: data.value ? this.monetaryValue(data.value) : undefined,
      discount: data.discount ? this.monetaryValue(data.discount) : undefined,
      shipping: data.shipping ? this.monetaryValue(data.shipping) : undefined,
      tax: data.tax ? this.monetaryValue(data.tax) : undefined,
      coupon: data.coupon,
      currency: data.currency
    })

    data.items.forEach(item => {
      this.push('product_event', {
        event_type: 'purchase',
        list: item.listId,
        product_id: item.sku,
        name: item.name,
        brand: item.brand,
        sku: item.sku,
        ean: item.ean,
        category: [
          item.category,
          item.category2,
          item.category3,
          item.category4,
          item.category5
        ].filter(c => typeof c === 'string' && c.length).join(' > '),
        variant: item.variant,
        price: item.price ? this.monetaryValue(item.price as number) : undefined,
        value: item.price ? this.monetaryValue(item.price as number) : undefined,
        quantity: typeof item.qty !== 'undefined' ? item.qty : 1,
        currency: item.currency,
        position: item.index,
        url: item.url,
        image_url: item.image
      })
    })
  }

  private async trackAddToCart (data: AddToCartConfig): Promise<void> {
    data.items.forEach(item => {
      this.push('product_event', {
        event_type: 'add to cart',
        list: item.listId,
        product_id: item.sku,
        name: item.name,
        brand: item.brand,
        sku: item.sku,
        ean: item.ean,
        category: [
          item.category,
          item.category2,
          item.category3,
          item.category4,
          item.category5
        ].filter(c => typeof c === 'string' && c.length).join(' > '),
        variant: item.variant,
        price: item.price ? this.monetaryValue(item.price as number) : undefined,
        value: item.price ? this.monetaryValue(item.price as number) : undefined,
        quantity: typeof item.qty !== 'undefined' ? item.qty : 1,
        currency: item.currency,
        position: item.index,
        url: item.url,
        image_url: item.image
      })
    })
  }

  private async trackViewItem (data: ViewItemConfig): Promise<void> {
    data.items.forEach(item => {
      this.push('product_event', {
        event_type: 'view',
        list: item.listId,
        product_id: item.sku,
        name: item.name,
        brand: item.brand,
        sku: item.sku,
        ean: item.ean,
        category: [
          item.category,
          item.category2,
          item.category3,
          item.category4,
          item.category5
        ].filter(c => typeof c === 'string' && c.length).join(' > '),
        variant: item.variant,
        price: item.price ? this.monetaryValue(item.price as number) : undefined,
        value: item.price ? this.monetaryValue(item.price as number) : undefined,
        quantity: typeof item.qty !== 'undefined' ? item.qty : 1,
        currency: item.currency,
        position: item.index,
        url: item.url,
        image_url: item.image
      })
    })
  }

  private async trackViewItemList (data: ViewItemListConfig): Promise<void> {
    data.items.forEach(item => {
      this.push('product_event', {
        event_type: 'view',
        list: item.listId,
        product_id: item.sku,
        name: item.name,
        brand: item.brand,
        sku: item.sku,
        ean: item.ean,
        category: [
          item.category,
          item.category2,
          item.category3,
          item.category4,
          item.category5
        ].filter(c => typeof c === 'string' && c.length).join(' > '),
        variant: item.variant,
        price: item.price ? this.monetaryValue(item.price as number) : undefined,
        value: item.price ? this.monetaryValue(item.price as number) : undefined,
        quantity: typeof item.qty !== 'undefined' ? item.qty : 1,
        currency: item.currency,
        position: item.index,
        url: item.url,
        image_url: item.image
      })
    })
  }
}
