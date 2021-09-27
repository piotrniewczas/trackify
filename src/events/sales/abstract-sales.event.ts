import {CurrencyCode, TrackifyGlobals} from "../../interfaces/trackify-globals";
import {AbstractEvent} from "../abstract.event";

export abstract class AbstractSalesEvent extends AbstractEvent {
  setGlobals(globals: TrackifyGlobals): void {
    if (globals.currency && !this.config.currency) {
      this.config.currency = globals.currency;
    }

    if (globals.currency && Array.isArray(this.config.items)) {
      this.config.items = this.config.items.map(item => {
        if (!item.currency) {
          item.currency = globals.currency as CurrencyCode;
        }

        return item;
      })
    }

    if (globals.brand && Array.isArray(this.config.items)) {
      this.config.items = this.config.items.map(item => {
        if (item.brand === undefined) {
          item.brand = globals.brand as string;
        }

        return item;
      });
    }
  }
}
