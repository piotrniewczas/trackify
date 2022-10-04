import { AnalyticsEvent } from '../../interfaces/analytics-event'
import { AbstractEvent } from '../abstract.event'
import { UserDataConfig } from '../../interfaces/events/config'

export class UserDataEvent extends AbstractEvent implements AnalyticsEvent<UserDataConfig> {
  name = 'user_data_update'

  constructor (protected config: UserDataConfig) {
    super(config)
  }

  getData (): UserDataConfig {
    return {
      id: this.config.id,
      shop_id: this.config.shop_id,
      email: this.config.email,
      firstname: this.config.firstname,
      lastname: this.config.lastname,
      dateOfBirth: this.config.dateOfBirth,
      phone: this.config.phone
    }
  }
}
