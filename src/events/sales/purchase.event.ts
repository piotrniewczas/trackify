import { AnalyticsEvent } from "../../interfaces/analytics-event";
import { AbstractSalesEvent } from "./abstract-sales.event";
import { PurchaseConfig } from "../../interfaces/events/config";

export class PurchaseEvent extends AbstractSalesEvent implements AnalyticsEvent<PurchaseConfig> {
  name = 'purchase';

  constructor (protected config: PurchaseConfig) {
    super(config);
  }

  getData (): PurchaseConfig {
    return {
      currency: this.config.currency,
      transactionId: this.config.transactionId,
      value: (this.config.value - (this.config.shipping ?? 0)),
      affiliation: this.config.affiliation,
      coupon: this.config.coupon,
      shipping: this.config.shipping,
      tax: this.config.tax,
      items: Array.isArray(this.config.items) ? this.config.items.map(item => ({ ...item })) : [],
      discount: this.config.discount,
      customer: this.config.customer ?? undefined,
      event: this.config.event,
      organization: this.config.organization,
      ...(this.config.isPremium ? { isPremium: this.config.isPremium} : {}),
      ...(this.config.eventId ? { eventId: this.config.eventId} : {}),
    }
  }
}
