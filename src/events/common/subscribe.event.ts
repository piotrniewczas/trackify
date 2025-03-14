import { AnalyticsEvent } from '../../interfaces/analytics-event'
import { AbstractEvent } from '../abstract.event'
import { SubscribeConfig } from '../../interfaces/events/config'

export class SubscribeEvent extends AbstractEvent implements AnalyticsEvent<SubscribeConfig> {
  name = 'subscribe'

  constructor (protected config: SubscribeConfig) {
    super(config)
  }

  getData (): SubscribeConfig {
    return {
      email: this.config.email,
      list: this.config.list,
      allow_marketing: this.config.allow_marketing,
      allow_sms_marketing: this.config.allow_sms_marketing,
      allow_policy: this.config.allow_policy,
      language: this.config.language,
      source: this.config.source,
      ...(this.config.eventId ? { eventId: this.config.eventId} : {}),
    }
  }
}
