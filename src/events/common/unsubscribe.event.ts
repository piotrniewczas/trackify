import { AnalyticsEvent } from '../../interfaces/analytics-event'
import { AbstractEvent } from '../abstract.event'
import { SubscribeConfig } from '../../interfaces/events/config'

export class UnsubscribeEvent extends AbstractEvent implements AnalyticsEvent<SubscribeConfig> {
  name = 'unsubscribe'

  constructor (protected config: SubscribeConfig) {
    super(config)
  }

  getData (): SubscribeConfig {
    return {
      email: this.config.email,
      list: this.config.list ?? '',
      allow_marketing: this.config.allow_marketing,
      allow_policy: this.config.allow_policy,
      language: this.config.language ?? '',
      source: this.config.source ?? ''
    }
  }
}
