import {AnalyticsDriver} from "../interfaces/analytics-driver";
import {AnalyticsEvent} from "../interfaces/analytics-event";

export default class DebugBrowserDriver implements AnalyticsDriver {
  public async load(): Promise<boolean> {
    console.debug('[Trackify] Method `load` called.');

    return true;
  }

  public supportsEvent(event: AnalyticsEvent<unknown>): boolean {
    console.debug('[Trackify] Method `supportsEvent` called.', event.name, event.getData());

    return true;
  }

  public async track(event: AnalyticsEvent<unknown>): Promise<void> {
    console.debug('[Trackify] Method `track` called.', event.name, event.getData());
  }
}
