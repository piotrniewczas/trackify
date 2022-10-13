import {AnalyticsDriver} from "../interfaces/analytics-driver";

export default class GTMServerDriver implements AnalyticsDriver {
  public name = 'GTMServerDriver'

  public async load(): Promise<boolean> {
    return false;
  }

  public supportsEvent(): boolean {
    return false;
  }

  public async track(): Promise<void> {
    return;
  }
}
