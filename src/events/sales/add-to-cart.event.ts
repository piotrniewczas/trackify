import {AnalyticsEvent} from "../../interfaces/analytics-event";
import {AbstractSalesEvent} from "./abstract-sales.event";
import {AddToCartConfig} from "../../interfaces/events/config";

export class AddToCartEvent extends AbstractSalesEvent implements AnalyticsEvent<AddToCartConfig> {
  name = 'add_to_cart';

  constructor(protected config: AddToCartConfig) {
    super(config);
  }

  getData(): AddToCartConfig {
    return {
      currency: this.config.currency,
      value: this.config.value,
      items: Array.isArray(this.config.items) ? this.config.items.map(item => ({...item})) : [],
    }
  }
}
