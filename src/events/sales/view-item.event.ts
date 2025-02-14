import {AnalyticsEvent} from "../../interfaces/analytics-event";
import {AbstractSalesEvent} from "./abstract-sales.event";
import {ViewItemConfig} from "../../interfaces/events/config";

export class ViewItemEvent extends AbstractSalesEvent implements AnalyticsEvent<ViewItemConfig> {
  name = 'view_item';

  constructor(protected config: ViewItemConfig) {
    super(config);
  }

  getData(): ViewItemConfig {
    return {
      currency: this.config.currency,
      value: this.config.value,
      items: Array.isArray(this.config.items) ? this.config.items.map(item => ({...item})) : [],
      ...(this.config.eventId ? { eventId: this.config.eventId} : {}),
    }
  }
}
