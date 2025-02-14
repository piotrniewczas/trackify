import {AnalyticsEvent} from "../../interfaces/analytics-event";
import {AbstractSalesEvent} from "./abstract-sales.event";
import {RemoveFromCartConfig} from "../../interfaces/events/config";

export class RemoveFromCartEvent extends AbstractSalesEvent implements AnalyticsEvent<RemoveFromCartConfig> {
  name = 'remove_from_cart';

  constructor(protected config: RemoveFromCartConfig) {
    super(config);
  }

  getData(): RemoveFromCartConfig {
    return {
      currency: this.config.currency,
      value: this.config.value,
      items: Array.isArray(this.config.items) ? this.config.items.map(item => ({...item})) : [],
      ...(this.config.eventId ? { eventId: this.config.eventId} : {}),
    }
  }
}
