import { AnalyticsDriver } from '../interfaces/analytics-driver'

export default class GetResponseServerDriver implements AnalyticsDriver {
  public name = 'GetResponseServerDriver'

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
