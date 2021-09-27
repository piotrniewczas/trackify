/**
 * This file is the entrypoint of browser builds.
 * The code executes when loaded in a browser.
 */
import { Trackify } from './main';
import * as Tokens from './tokens';
import * as Events from './events';

interface GlobalTrackify {
  Constructor: { new(): Trackify },
  Drivers: typeof Tokens,
  Events: typeof Events,
  [p: string]: unknown
}

declare global {
  interface Window {
    Trackify: GlobalTrackify
  }
}

window.Trackify = {
  Constructor: Trackify,
  Drivers: Tokens,
  Events
};
