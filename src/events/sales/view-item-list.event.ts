import {AnalyticsEvent} from "../../interfaces/analytics-event";
import {AbstractSalesEvent} from "./abstract-sales.event";
import {ViewItemListConfig} from "../../interfaces/events/config";

export class ViewItemListEvent extends AbstractSalesEvent implements AnalyticsEvent<ViewItemListConfig> {
  name = 'view_item_list';

  constructor(protected config: ViewItemListConfig) {
    super(config);
  }

  getData(): ViewItemListConfig {
    return {
      listId: this.config.listId,
      listName: this.config.listName,
      items: Array.isArray(this.config.items) ? this.config.items.map(item => ({...item})) : [],
    }
  }
}
