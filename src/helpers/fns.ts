import {AnalyticsEvent, CustomAnalyticsEvent} from "../interfaces/analytics-event";

export const isServer = (): boolean => typeof window === 'undefined';

export const isBrowser = (): boolean => !isServer();

export function isCustomEvent (event: AnalyticsEvent<unknown> | CustomAnalyticsEvent<unknown>): event is CustomAnalyticsEvent<unknown> {
  return typeof (<CustomAnalyticsEvent<unknown>>event).forDriver === 'function';
}
