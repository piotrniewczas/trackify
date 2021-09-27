import {AnalyticsDriver} from "../interfaces/analytics-driver";
import {AnalyticsEvent} from "../interfaces/analytics-event";

export default class DebugServerDriver implements AnalyticsDriver {
  public async load(): Promise<boolean> {
    console.debug('[Trackify] Method `load` called.');

    return true;
  }

  public supportsEvent(event: AnalyticsEvent): boolean {
    console.debug('[Trackify] Method `supportsEvent` called.', event);

    return true;
  }

  public async track(event: AnalyticsEvent): Promise<void> {
    console.debug('[Trackify] Method `track` called.', event);
  }
}
