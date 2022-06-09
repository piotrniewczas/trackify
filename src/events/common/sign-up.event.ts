import { AnalyticsEvent } from '../../interfaces/analytics-event'
import { AbstractEvent } from '../abstract.event'
import { SignUpConfig } from '../../interfaces/events/config'

export class SignUpEvent extends AbstractEvent implements AnalyticsEvent<SignUpConfig> {
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
