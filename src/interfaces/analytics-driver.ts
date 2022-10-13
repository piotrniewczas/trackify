import { AnalyticsEvent } from './analytics-event'

export interface AnalyticsDriver {
  name: string

  load (): Promise<boolean>;

  supportsEvent (event: AnalyticsEvent<unknown>): boolean;

  track (event: AnalyticsEvent<unknown>): Promise<void>;
}

export type AnalyticsDriverConfig = Record<string, unknown>;

export interface AnalyticsDriverConstructor {
  new (config: AnalyticsDriverConfig): AnalyticsDriver
}

export type AnalyticsDriverToken = symbol;
