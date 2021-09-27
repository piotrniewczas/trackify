import {AnalyticsEvent} from "./analytics-event";

export interface AnalyticsQueue {
  run(): void;

  onProcessed(callback: (event: AnalyticsEvent<unknown>) => void): void;

  push(event: AnalyticsEvent<unknown>): void;
}

export interface AnalyticsQueueConstructor {
  new(): AnalyticsQueue;
}
