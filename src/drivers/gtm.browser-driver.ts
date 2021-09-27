import {AnalyticsDriver} from "../interfaces/analytics-driver";
import {AnalyticsEvent} from "../interfaces/analytics-event";
import {
  AddPaymentInfoConfig,
  AddShippingInfoConfig,
  AddToCartConfig,
  BeginCheckoutConfig,
  PurchaseConfig,
  RemoveFromCartConfig,
  ViewCartConfig,
  ViewItemConfig,
  ViewItemListConfig
} from "../interfaces/events/config";
import {CurrencyCode} from "../interfaces/trackify-globals";

declare global {
  interface Window {
    dataLayer: Array<{ event?: string, ecommerce: Record<string, unknown> | null }>;
  }
}

export interface GTMItem {
  item_id: string,
  item_name: string,
  affiliation: string | undefined,
  coupon: string | undefined,
  currency: string | undefined,
  discount: number | undefined,
  index: number | undefined,
  item_brand: string | undefined,
  item_category: string | undefined,
  item_category2: string | undefined,
  item_category3: string | undefined,
  item_category4: string | undefined,
  item_category5: string | undefined,
  item_list_id: string | number | undefined,
  item_list_name: string | undefined,
  item_variant: string | undefined,
  location_id: string | number | undefined,
  price: number | undefined,
  quantity: number | undefined
}

export type SupportedEventData =
  AddPaymentInfoConfig
  | AddShippingInfoConfig
  | AddToCartConfig
  | BeginCheckoutConfig
  | PurchaseConfig
  | RemoveFromCartConfig
  | ViewCartConfig
  | ViewItemConfig
  | ViewItemListConfig;
export type SupportedEvent = AnalyticsEvent<SupportedEventData>;

export default class GTMBrowserDriver implements AnalyticsDriver {
  public static SUPPORTED_EVENTS = ['add_payment_info', 'add_shipping_info', 'add_to_cart', 'begin_checkout', 'purchase', 'remove_from_cart', 'view_cart', 'view_item', 'view_item_list'];

  public async load(): Promise<boolean> {
    return typeof window.dataLayer !== 'undefined';
  }

  public supportsEvent(event: AnalyticsEvent<unknown>): boolean {
    return GTMBrowserDriver.SUPPORTED_EVENTS.includes(event.name);
  }

  public async track(event: SupportedEvent): Promise<void> {
    const data = event.getData();

    switch (event.name) {
      case 'add_payment_info':
        return await this.trackAddPaymentInfo(data as AddPaymentInfoConfig);
      case 'add_shipping_info':
        return await this.trackAddShippingInfo(data as AddShippingInfoConfig);
      case 'add_to_cart':
        return await this.trackAddToCart(data as AddToCartConfig);
      case 'begin_checkout':
        return await this.trackBeginCheckout(data as BeginCheckoutConfig);
      case 'purchase':
        return await this.trackPurchase(data as PurchaseConfig);
      case 'remove_from_cart':
        return await this.trackRemoveFromCart(data as RemoveFromCartConfig);
      case 'view_cart':
        return await this.trackViewCart(data as ViewCartConfig);
      case 'view_item':
        return await this.trackViewItem(data as ViewItemConfig);
      case 'view_item_list':
        return await this.trackViewItemList(data as ViewItemListConfig);
      default:
        throw new TypeError(`Event ${event.name} not supported!`);
    }
  }

  protected async trackAddPaymentInfo(data: AddPaymentInfoConfig): Promise<void> {
    this.push('add_payment_info', {
      currency: data.currency,
      value: data.value,
      coupon: data.coupon,
      payment_type: data.paymentMethod,
      items: this.getItems(data),
    });
  }

  protected async trackAddShippingInfo(data: AddShippingInfoConfig): Promise<void> {
    this.push('add_shipping_info', {
      currency: data.currency,
      value: data.value,
      coupon: data.coupon,
      shipping_tier: data.shippingTier,
      items: this.getItems(data),
    });
  }

  protected async trackAddToCart(data: AddToCartConfig): Promise<void> {
    this.push('add_to_cart', {
      currency: data.currency,
      value: data.value,
      items: this.getItems(data),
    });
  }

  protected async trackBeginCheckout(data: BeginCheckoutConfig): Promise<void> {
    this.push('begin_checkout', {
      currency: data.currency,
      value: data.value,
      coupon: data.coupon,
      items: this.getItems(data),
    });
  }

  protected async trackPurchase(data: PurchaseConfig): Promise<void> {
    this.push('purchase', {
      currency: data.currency,
      transaction_id: data.transactionId,
      value: data.value,
      affiliation: data.affiliation,
      coupon: data.coupon,
      shipping: data.shipping,
      tax: data.tax,
      items: this.getItems(data),
    });
  }

  protected async trackRemoveFromCart(data: RemoveFromCartConfig): Promise<void> {
    this.push('remove_from_cart', {
      currency: data.currency,
      value: data.value,
      items: this.getItems(data),
    });
  }

  protected async trackViewCart(data: ViewCartConfig): Promise<void> {
    this.push('view_cart', {
      currency: data.currency,
      value: data.value,
      items: this.getItems(data),
    });
  }

  protected async trackViewItem(data: ViewItemConfig): Promise<void> {
    this.push('view_item', {
      currency: data.currency,
      value: data.value,
      items: this.getItems(data),
    });
  }

  protected async trackViewItemList(data: ViewItemListConfig): Promise<void> {
    this.push('view_item_list', {
      item_list_id: data.listId,
      item_list_name: data.listName,
      items: this.getItems(data),
    });
  }

  protected getItems(data: SupportedEventData): Array<GTMItem> {
    return Array.isArray(data.items) ? data.items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      affiliation: item.affiliation,
      coupon: item.coupon,
      currency: item.currency,
      discount: item.discount,
      index: item.index,
      item_brand: item.brand,
      item_category: item.category,
      item_category2: item.category2,
      item_category3: item.category3,
      item_category4: item.category4,
      item_category5: item.category5,
      item_list_id: item.listId,
      item_list_name: item.listName,
      item_variant: item.variant,
      location_id: item.locationId,
      price: item.price,
      quantity: item.quantity
    })) : []
  }

  protected push(eventName: string, payload: Record<string, string | number | CurrencyCode | Array<GTMItem> | undefined>): void {
    window.dataLayer.push({ecommerce: null});
    window.dataLayer.push({
      event: eventName,
      ecommerce: payload,
    });
  }
}
