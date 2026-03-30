import { TrackifyGlobals } from './trackify-globals'
import { CustomerConfig } from "./events/config";

export type AnalyticsEventConfig = Record<string, string | number | undefined | Array<Record<string, string | number | undefined>> | Record<string, string | number | undefined> | CustomerConfig> & {
  _params?: Record<string, string | number | undefined>
};

export interface AnalyticsEvent<T> {
  name: string;
  label?: string;

  getData (): T;

  setGlobals (globals: TrackifyGlobals): void;
}

export interface CustomAnalyticsEvent<T> extends AnalyticsEvent<T> {
  forDriver (driverName: string): Record<string, unknown> | null;
}
