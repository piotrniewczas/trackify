import {AnalyticsEvent} from "./analytics-event";

export interface AnalyticsQueue {
  run(): void;

  onProcessed(callback: (event: AnalyticsEvent) => void): void;

  push(event: AnalyticsEvent): void;
}

export interface AnalyticsQueueConstructor {
  new(): AnalyticsQueue;
}
