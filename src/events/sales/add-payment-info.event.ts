import {AbstractSalesEvent} from "./abstract-sales.event";
import {AddPaymentInfoConfig} from "../../interfaces/events/config";
import {AnalyticsEvent} from "../../interfaces/analytics-event";

export class AddPaymentInfoEvent extends AbstractSalesEvent implements AnalyticsEvent<AddPaymentInfoConfig> {
  name = 'add_payment_info';

  constructor(protected config: AddPaymentInfoConfig) {
    super(config);
  }

  getData(): AddPaymentInfoConfig {
    return {
      currency: this.config.currency,
      value: this.config.value,
      coupon: this.config.coupon,
      paymentMethod: this.config.paymentMethod,
      items: Array.isArray(this.config.items) ? this.config.items.map(item => ({...item})) : [],
    };
  }
}
