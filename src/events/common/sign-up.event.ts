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
      method: this.config.method,
      firstname: this.config.firstname,
      lastname: this.config.lastname,
      email: this.config.email,
      id: this.config.id,
      shop_id: this.config.shop_id,
      allow_marketing: this.config.allow_marketing,
      allow_sms_marketing: this.config.allow_sms_marketing,
    }
  }
}
