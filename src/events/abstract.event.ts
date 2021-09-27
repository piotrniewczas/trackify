import {AnalyticsEvent as AnalyticsEventInterface, AnalyticsEventConfig} from "../interfaces/analytics-event";
import {TrackifyGlobals} from "../interfaces/trackify-globals";

export abstract class AbstractEvent implements AnalyticsEventInterface<AnalyticsEventConfig> {
  abstract name: string;

  protected constructor(protected config: AnalyticsEventConfig) {
    if (!this.config) {
      throw new TypeError('AbstractEvent config is undefined.');
    }
  }

  abstract getData(): AnalyticsEventConfig;

  abstract setGlobals(globals: TrackifyGlobals): void;
}
