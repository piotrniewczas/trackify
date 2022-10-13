import { AnalyticsDriver } from '../interfaces/analytics-driver'

export default class SyneriseServerDriver implements AnalyticsDriver {
  public name = 'SyneriseServerDriver'

  public async load (): Promise<boolean> {
    return false
  }

  getName (): string {
    return this.name
  }

  public supportsEvent (): boolean {
    return false
  }

  public async track (): Promise<void> {
    return
  }
}
