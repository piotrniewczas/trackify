import {AnalyticsEvent} from "../../interfaces/analytics-event";
import {AbstractSalesEvent} from "./abstract-sales.event";
import {BeginCheckoutConfig} from "../../interfaces/events/config";

export class BeginCheckoutEvent extends AbstractSalesEvent implements AnalyticsEvent<BeginCheckoutConfig> {
  name = 'begin_checkout';

  constructor(protected config: BeginCheckoutConfig) {
    super(config);
  }

  getData(): BeginCheckoutConfig {
    return {
      currency: this.config.currency,
      value: this.config.value,
      coupon: this.config.coupon,
      items: Array.isArray(this.config.items) ? this.config.items.map(item => ({...item})) : [],
    }
  }
}
