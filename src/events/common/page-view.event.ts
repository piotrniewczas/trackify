import {AbstractEvent} from "../abstract.event";
import {AnalyticsEvent} from "../../interfaces/analytics-event";
import {PageViewConfig} from "../../interfaces/events/config";

export class PageViewEvent extends AbstractEvent implements AnalyticsEvent<PageViewConfig> {
  public name = 'page_view';

  constructor(protected config: PageViewConfig) {
    super(config);
  }

  getData(): PageViewConfig {
    return {
      pagePath: this.config.pagePath,
      pageTitle: this.config.pageTitle,
      language: this.config.language,
      currency: this.config.currency
    }
  }
}
