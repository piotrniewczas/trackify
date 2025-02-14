import {AbstractSalesEvent} from "./abstract-sales.event";
import {AddShippingInfoConfig} from "../../interfaces/events/config";
import {AnalyticsEvent} from "../../interfaces/analytics-event";

export class AddShippingInfoEvent extends AbstractSalesEvent implements AnalyticsEvent<AddShippingInfoConfig> {
  name = 'add_shipping_info';

  constructor(protected config: AddShippingInfoConfig) {
    super(config);
  }

  getData(): AddShippingInfoConfig {
    return {
      currency: this.config.currency,
      value: this.config.value,
      coupon: this.config.coupon,
      shippingTier: this.config.shippingTier,
      items: Array.isArray(this.config.items) ? this.config.items.map(item => ({...item})) : [],
      ...(this.config.eventId ? { eventId: this.config.eventId} : {}),
    };
  }
}
