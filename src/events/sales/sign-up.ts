import { AnalyticsEvent } from '../../interfaces/analytics-event'
import { AbstractSalesEvent } from './abstract-sales.event'
import { SignUpConfig } from '../../interfaces/events/config'

export class SignUpEvent extends AbstractSalesEvent implements AnalyticsEvent<SignUpConfig> {
  name = 'sign_up'

  constructor (protected config: SignUpConfig) {
    super(config)
  }

  getData (): SignUpConfig {
    return {
      method: this.config.method
    }
  }
}
