import { AnalyticsEvent } from '../../interfaces/analytics-event'
import { AbstractSalesEvent } from './abstract-sales.event'
import { LoginConfig } from '../../interfaces/events/config'

export class LoginEvent extends AbstractSalesEvent implements AnalyticsEvent<LoginConfig> {
  name = 'login'

  constructor (protected config: LoginConfig) {
    super(config)
  }

  getData (): LoginConfig {
    return {
      method: this.config.method
    }
  }
}
