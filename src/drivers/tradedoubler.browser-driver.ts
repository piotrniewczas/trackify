import { AnalyticsDriver } from '../interfaces/analytics-driver'
import { AnalyticsEvent, CustomAnalyticsEvent } from '../interfaces/analytics-event'
import { PageType } from '../interfaces/trackify-globals'

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
import { Item } from '../interfaces/events/item';

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

export interface TradeDoublerItem extends Record<string, unknown> {
  id: string,
  price: string,
  currency: string,
  name: string,
  qty: string
}

declare global {
  interface Window {
    TDConf?: {
      Config?: {
        products?: Array<TradeDoublerItem>
        orderId?: string,
        orderValue?: string,
        pageType?: PageType
      },
      execTag: (pageType: PageType) => void
    }
  }
}

export default class TradeDoublerBrowserDriver implements AnalyticsDriver {

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
  public name = 'TradeDoublerBrowserDriver'

  public async load (): Promise<boolean> {
    try {
      this.reportDebug('[TradeDoubler] Load')
      await this.checkIfLoaded()
      if (window && window.TDConf && 'TDConf' in window) {
        window.TDConf.Config = window.TDConf.Config || {}
      }

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
    return TradeDoublerBrowserDriver.SUPPORTED_EVENTS.includes(event.name) || event.name.indexOf('custom.') >= 0
  }

  public async track (event: AnalyticsEvent<unknown>): Promise<void> {
    this.reportDebug('[TradeDoubler] track')

    const data = event.getData()
    this.reportDebug('[TradeDoubler] track ' + event.name)

    switch (event.name) {
      case 'page_view':
        return await this.trackPageView(data as PageViewConfig)
      case 'add_payment_info':
        return await this.trackAddPaymentInfo(data as AddPaymentInfoConfig)
      case 'add_to_cart':
        return await this.trackAddToCart(data as AddToCartConfig)
      case 'purchase':
        return await this.trackPurchase(data as PurchaseConfig)
      case 'subscribe':
        return await this.subscribe(data as SubscribeConfig)
      case 'unsubscribe':
        return await this.unsubscribe(data as SubscribeConfig)
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

  protected async trackPageView (data: PageViewConfig): Promise<void> {
    if (window && window.TDConf && 'TDConf' in window && window.TDConf.execTag && window.TDConf.Config) {
      this.reportDebug('trackPageView')

      const pageType = window.TDConf.Config.pageType || data.pageType || PageType.Other

      if ([PageType.Homepage, PageType.Other].includes(pageType)) {
        this.setPageType(pageType)
      }

      if (!window.TDConf.Config.pageType) {
        throw new TypeError(`PageType should be defined`)
      }

      window.TDConf.execTag(window.TDConf.Config.pageType)
      this.resetConfig()
    }
  }

  protected setProducts (
    items: Item[],
  ): void {
    if (window && window.TDConf && 'TDConf' in window && window.TDConf.Config) {
      window.TDConf.Config.products = items.map((item) => {
        return {
          id: item.id,
          price: `${item.price ? this.monetaryValue(item.price as number) : 0}`,
          currency: item.currency ?? '',
          name: item.name,
          qty: `${item.quantity ?? ''}`
        }
      })
    }
  }

  protected setPageType (
    pageType: PageType,
  ): void {
    if (window && window.TDConf && 'TDConf' in window && window.TDConf.Config) {
      window.TDConf.Config.pageType = pageType;
    }
  }

  protected setOrder (
    orderId: string,
    orderValue: number,
  ): void {
    if (window && window.TDConf && 'TDConf' in window && window.TDConf.Config) {
      window.TDConf.Config.orderId = orderId
      window.TDConf.Config.orderValue = `${this.monetaryValue(orderValue ?? 0)}`
    }
  }

  protected resetConfig (): void {
    if (window && window.TDConf && 'TDConf' in window && window.TDConf.Config) {
      window.TDConf.Config = {};
    }
  }

  protected getCookieTD (name: string) {
    const dc = document.cookie
    const prefix = name + "="
    let begin = dc.indexOf("; " + prefix)

    if (begin == -1) {
      begin = dc.indexOf(prefix)
      if (begin != 0) return null
    }
    else {
      begin += 2
    }

    let end = document.cookie.indexOf(";", begin)

    if (end == -1) {
      end = dc.length
    }

    return decodeURIComponent(dc.substring(begin + prefix.length, end))
  }

  protected prepareFrame (tburl: string) {
    const ifrm = document.createElement("IFRAME")
    ifrm.setAttribute("src", tburl)
    ifrm.style.width = 1 + "px"
    ifrm.style.height = 1 + "px"
    ifrm.style.border = "none"
    document.body.appendChild(ifrm)
  }

  protected createTradeDoublerConversionPixel (
    payload: PurchaseConfig,
  ): void {
    if (window && window.document) {
      // A unique identifier for the transaction. For a sale, this is typically the order number.
      const orderNumber = payload.transactionId
      // Value of the sale.
      const orderValue = this.monetaryValue(payload.value)
      // Currency of the sale.
      const currency = payload.currency
      // Transmit a list of items ordered in the reportInfo parameter.
      const reportInfo = payload.items.map(item => {
        return `f1=${item.id}&f2=${item.name}&f3=${this.monetaryValue(item?.price ?? 0)}&f4=${item.quantity}`
      }).join('|')
      // Voucher code used by user.
      const voucher = payload.coupon
      const tduid = this.getCookieTD("TRADEDOUBLER")
      /***** IMPORTANT: *****/
      /***** Please consult Tradedoubler before modifying the code below this line. *****/
      const domain = "tbs.tradedoubler.com"
      const checkNumberName = "orderNumber"
      const scheme = "https"
      const { organization, event } = payload
      const trackBackUrl = `${scheme}://${domain}/report?organization=${organization}&event=${event}&${checkNumberName}=${orderNumber}&orderValue=${orderValue}&currency=${currency}&voucher=${voucher}&tduid=${tduid}&type=iframe&reportInfo=${encodeURIComponent(reportInfo)}`

      this.prepareFrame(trackBackUrl)

      if (tduid) {
        const img = document.createElement('img')
        img.src = `${scheme}://imgstatic.eu/report?o=${organization}&e=${event}&ordnum=${orderNumber}&ordval=${orderValue}&curr=${currency}&tduid=${tduid}`
        document.body.appendChild(img)
      }
    }
  }

  protected checkIfLoaded (timeout = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.TDConf) {
        resolve()
      } else if (timeout >= TradeDoublerBrowserDriver.AVAILABILITY_CHECK_MAX_TIMEOUT) {
        reject()
      } else {
        setTimeout(() => {
          this.checkIfLoaded(timeout + TradeDoublerBrowserDriver.AVAILABILITY_CHECK_TIMEOUT).then(() => resolve())
            .catch(() => reject())
        }, TradeDoublerBrowserDriver.AVAILABILITY_CHECK_TIMEOUT)
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

  private async trackSignUp (_data: SignUpConfig): Promise<void> {
    this.setPageType(PageType.Signup)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async trackAddPaymentInfo (_data: AddPaymentInfoConfig): Promise<void> {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async unsubscribe (_data: SubscribeConfig): Promise<void> {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async subscribe (_data: SubscribeConfig): Promise<void> {
    //
  }

  protected async trackViewCart (data: ViewCartConfig): Promise<void> {
    this.setProducts(data.items)
    this.setPageType(PageType.Basket)
  }

  private async trackPurchase (data: PurchaseConfig): Promise<void> {
    this.createTradeDoublerConversionPixel(data);
    this.setOrder(data.transactionId, data.value)
    this.setProducts(data.items)
    this.setPageType(PageType.Purchase)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async trackAddToCart (_data: AddToCartConfig): Promise<void> {
    //
  }

  private async trackViewItem (data: ViewItemConfig): Promise<void> {
    this.setProducts(data.items)
    this.setPageType(PageType.Product)
  }

  private async trackViewItemList (data: ViewItemListConfig): Promise<void> {
    this.setProducts(data.items)
    this.setPageType(PageType.Listing)
  }
}
