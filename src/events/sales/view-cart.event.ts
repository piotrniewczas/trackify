import { AnalyticsEvent } from "../../interfaces/analytics-event";
import { AbstractSalesEvent } from "./abstract-sales.event";
import { ViewCartConfig } from "../../interfaces/events/config";

export class ViewCartEvent extends AbstractSalesEvent implements AnalyticsEvent<ViewCartConfig> {
  name = 'view_cart';

  constructor (protected config: ViewCartConfig) {
    super(config);
  }

  getData (): ViewCartConfig {
    return {
      currency: this.config.currency,
      value: this.config.value,
      totalQuantity: this.config.totalQuantity,
      items: Array.isArray(this.config.items) ? this.config.items.map(item => ({ ...item })) : [],
      ...(this.config.eventId ? { eventId: this.config.eventId} : {}),
    }
  }
}
