import { AnalyticsDriver } from '../interfaces/analytics-driver'
import { AnalyticsEvent, CustomAnalyticsEvent } from '../interfaces/analytics-event'
import { isCustomEvent } from '../helpers/fns'
import {
  AddPaymentInfoConfig,
  AddToCartConfig,
  LoginConfig,
  PageViewConfig,
  PurchaseConfig, SignUpConfig, SubscribeConfig, UserDataConfig,
  ViewItemConfig, ViewItemListConfig
} from '../interfaces/events/config'

declare global {
  interface Window {
    GrTracking?: (action: string, payload?: string | Record<string, string | number | boolean | null | undefined>) => void;
  }
}

export default class GetResponseBrowserDriver implements AnalyticsDriver {
  public static SUPPORTED_EVENTS = [
    'page_view',
    'add_payment_info',
    'add_to_cart',
    'purchase',
    'view_item',
    'view_item_list',
    'login',
    'sign_up',
    'subscribe',
    'unsubscribe'
  ]
  public static AVAILABILITY_CHECK_TIMEOUT = 1500
  public static LOAD_DRIVER_REPEATS = 5
  public name = 'GetResponseBrowserDriver'

  public async load(): Promise<boolean> {
    try {
      await this.checkIfGetResponseLoaded()

      return true
    } catch (e) {
      return false
    }
  }

  public supportsEvent(event: AnalyticsEvent<unknown>): boolean {
    return GetResponseBrowserDriver.SUPPORTED_EVENTS.includes(event.name) || event.name.indexOf('custom.') >= 0
  }

  public async track(event: AnalyticsEvent<unknown>): Promise<void> {
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
      case 'subscribe':
        return await GetResponseBrowserDriver.subscribe(data as SubscribeConfig)
      case 'unsubscribe':
        return await GetResponseBrowserDriver.unsubscribe(data as SubscribeConfig)
      default:
        throw new TypeError(`Event ${event.name} not supported!`)
    }
  }

  protected async trackPageView(data: PageViewConfig): Promise<void> {
    this.push('page_view', {
      URL: data.pagePath
    })
  }

  protected async trackCustom(event: CustomAnalyticsEvent<unknown>): Promise<void> {
    const data = event.forDriver(this.name)
    if (data === null) {
      return
    }

    if (typeof data.event_name !== 'string') {
      throw new TypeError(`Custom event ${event.name} has to provide event name for ${this.name} [forDriver.event_name]`)
    }

    if (data.event_payload && (typeof data.event_payload !== 'object' || typeof data.event_payload !== 'string')) {
      throw new TypeError(`Custom event ${event.name} has to provide event payload for ${this.name} [forDriver.event_payload]`)
    }

    return this.push(
      data.event_name,
      data.event_payload as string | Record<string, string | number | undefined>
    )
  }

  protected push(
    eventName: string,
    payload?: string | Record<string, string | number | undefined>
  ): void {
    if (window.GrTracking) {
      window.GrTracking(eventName, payload)
    }
  }

  protected checkIfGetResponseLoaded(index = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      if (index > GetResponseBrowserDriver.LOAD_DRIVER_REPEATS) {
        reject()
      }
      if (window.GrTracking) {
        resolve()
      } else {
        setTimeout(() => {
          this.checkIfGetResponseLoaded(index++)
            .then(() => resolve())
            .catch(() => reject())
        }, GetResponseBrowserDriver.AVAILABILITY_CHECK_TIMEOUT)
      }
    })
  }

  private async trackLogin(data: LoginConfig): Promise<void> {
    this.push('sign_in', {method: data.method})
  }

  private async trackSignUp(data: SignUpConfig): Promise<void> {
    if (data.email) {
      await GetResponseBrowserDriver.setUserId(data.email)
    }
    this.push('sign_in', {method: data.method})
    this.push('update', {
      first_name: data.firstname,
      last_name: data.lastname,
      email: data.email,
      shop_user_id: data.id,
      store_id: data.shop_id
    })
  }

  private async updateUserData(data: UserDataConfig): Promise<void> {
    if (data.email) {
      await GetResponseBrowserDriver.setUserId(data.email)
    }
    this.push('update', {
      first_name: data.firstname,
      last_name: data.lastname,
      email: data.email,
      shop_user_id: data.id,
      user_id: data.id,
      store_id: data.shop_id
    })
  }

  private async trackAddPaymentInfo(data: AddPaymentInfoConfig): Promise<void> {
    if (data.customer?.email) {
      await GetResponseBrowserDriver.setUserId(data.customer.email)
    }
    this.push('checkout_data_step')
    this.push('update', {
      first_name: data.customer?.firstname,
      last_name: data.customer?.lastname,
      email: data.customer?.email,
      phone_number: data.customer?.telephone
    })
  }

  private async trackPurchase(data: PurchaseConfig): Promise<void> {
    this.push('purchase', {
      user_id: data.customer?.id,
      order_id: data.transactionId,
      total: data.value,
      value: data.value,
      discount: data.discount,
      shipping: data.shipping,
      tax: data.tax,
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
        price: item.price,
        value: item.price,
        quantity: item.qty,
        currency: item.currency,
        position: item.index,
        url: item.url,
        image_url: item.image
      })
    })
  }

  private async trackAddToCart(data: AddToCartConfig): Promise<void> {
    data.items.forEach(item => {
      this.push('product_event', {
        event_type: 'add_to_cart',
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
        price: item.price,
        value: item.price,
        quantity: item.qty,
        currency: item.currency,
        position: item.index,
        url: item.url,
        image_url: item.image
      })
    })
  }

  private async trackViewItem(data: ViewItemConfig): Promise<void> {
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
        price: item.price,
        value: item.price,
        quantity: item.qty,
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
        event_type: 'view_list',
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
        price: item.price,
        value: item.price,
        quantity: item.qty,
        currency: item.currency,
        position: item.index,
        url: item.url,
        image_url: item.image
      })
    })
  }

  private static async subscribe (_data: SubscribeConfig): Promise<void> {
    if (window.GrTracking) {
      await this.setUserId(_data.email)
      window.GrTracking('subscribe', {
        email: _data.email,
        list: _data.list,
        newsletterAgreement: _data.allow_marketing,
        allowPolicy: _data.allow_policy,
        newsletterLanguage: _data.language,
        storeCode: _data.storeCode
      })
    }
  }

  private static async unsubscribe (_data: SubscribeConfig): Promise<void> {
    if (window.GrTracking) {
      await this.setUserId(_data.email)
      window.GrTracking('unsubscribe', {
        email: _data.email
      })
    }
  }

  private static async setUserId (email: string): Promise<void> {
    if (window.GrTracking) {
      window.GrTracking('setUserId', email)
    }
  }
}
