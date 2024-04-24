import { AnalyticsDriver } from '../interfaces/analytics-driver'

export default class CeneoServerDriver implements AnalyticsDriver {
  public name = 'CeneoServerDriver'

  public async load (): Promise<boolean> {
    return false
  }

  public supportsEvent (): boolean {
    return false
  }

  public async track (): Promise<void> {
    return
  }
}
