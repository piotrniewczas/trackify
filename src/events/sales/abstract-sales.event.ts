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

    if (globals.affiliation && Object.prototype.hasOwnProperty.call(this.getData(), 'affiliation') && !this.config.affiliation) {
      this.config.affiliation = globals.affiliation;
    }

    if (globals.affiliation && Array.isArray(this.config.items)) {
      this.config.items = this.config.items.map(item => {
        if (item.affiliation === undefined) {
          item.affiliation = globals.affiliation as string;
        }

        return item;
      })
    }
  }
}
