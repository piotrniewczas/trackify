import {AnalyticsEvent} from "./analytics-event";

export interface AnalyticsDriver {
  load(): Promise<boolean>;

  supportsEvent(event: AnalyticsEvent): boolean;

  track(event: AnalyticsEvent): Promise<void>;
}

export type AnalyticsDriverConfig = Record<string, unknown>;

export interface AnalyticsDriverConstructor {
  new(config: AnalyticsDriverConfig): AnalyticsDriver
}

export type AnalyticsDriverToken = symbol;
