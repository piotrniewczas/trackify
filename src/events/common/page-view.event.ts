import {AbstractEvent} from "../abstract.event";
import {AnalyticsEvent} from "../../interfaces/analytics-event";
import {PageViewConfig} from "../../interfaces/events/config";
import {TrackifyGlobals} from "../../interfaces/trackify-globals";

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

  setGlobals(globals: TrackifyGlobals): void {
    if (globals.currency && !this.config.currency) {
      this.config.currency = globals.currency;
    }

    if (globals.language && !this.config.language) {
      this.config.language = globals.language;
    }
  }
}
