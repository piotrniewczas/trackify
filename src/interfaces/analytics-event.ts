import {TrackifyGlobals} from "./trackify-globals";

export type AnalyticsEventConfig = Record<string, string | number | undefined | Array<Record<string, string | number | undefined>>>;

export interface AnalyticsEvent<T> {
  name: string;

  getData(): T;

  setGlobals(globals: TrackifyGlobals): void;
}

export interface CustomAnalyticsEvent<T> extends AnalyticsEvent<T> {
  forDriver(driverName: string): Record<string, unknown> | null;
}
