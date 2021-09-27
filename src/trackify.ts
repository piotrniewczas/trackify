import {
  AnalyticsDriver,
  AnalyticsDriverConfig,
  AnalyticsDriverConstructor,
  AnalyticsDriverToken
} from "./interfaces/analytics-driver";
import {AnalyticsEvent} from "./interfaces/analytics-event";
import {analyticsDrivers} from "./drivers";
import {TrackifyQueue} from "./helpers/trackify-queue";
import {AnalyticsQueue, AnalyticsQueueConstructor} from "./interfaces/analytics-queue";
import {TrackifyGlobals} from "./interfaces/trackify-globals";

export class Trackify {
  public static QUEUE_DRIVER: AnalyticsQueueConstructor = TrackifyQueue;
  public GLOBALS: TrackifyGlobals = {
    currency: null,
    brand: null,
  };
  protected drivers: Map<AnalyticsDriverToken, AnalyticsDriver> = new Map<AnalyticsDriverToken, AnalyticsDriver>();
  protected driversResolved = false;
  protected queue: AnalyticsQueue;

  protected registeredDrivers: Set<[AnalyticsDriverToken, AnalyticsDriverConfig | undefined]> = new Set<[AnalyticsDriverToken, AnalyticsDriverConfig | undefined]>();

  constructor() {
    this.queue = new Trackify.QUEUE_DRIVER();

    this.init();
  }

  public async track(event: AnalyticsEvent<unknown>): Promise<void> {
    if (!event) {
      return;
    }

    event.setGlobals(this.GLOBALS);

    this.queue.push(event);
  }

  public useDriver(driver: AnalyticsDriverToken, config?: AnalyticsDriverConfig): void {
    this.registeredDrivers.add([driver, config]);
  }

  public useDrivers(drivers: Array<[AnalyticsDriverToken, AnalyticsDriverConfig]>): void {
    for (const [driver, config] of drivers) {
      this.useDriver(driver, config);
    }
  }

  public async loadDrivers(): Promise<void> {
    if (this.driversResolved) {
      return;
    }

    for (const [token, config] of this.registeredDrivers) {
      try {
        const driverConstructor: AnalyticsDriverConstructor = await this.loadDriver(token);
        const driver = new driverConstructor(config || {});

        const driverLoaded = await driver.load();

        if (driverLoaded) {
          this.drivers.set(token, driver);
        }
      } catch (error: unknown) {
        this.reportError(error);
      }
    }

    await this.afterDriversResolved();
  }

  protected async afterDriversResolved(): Promise<void> {
    this.driversResolved = true;

    this.queue.run();
  }

  protected init(): void {
    this.queue.onProcessed((event: AnalyticsEvent<unknown>) => {
      this.drivers.forEach(async (driver: AnalyticsDriver) => {
        if (driver.supportsEvent(event)) {
          try {
            await driver.track(event);
          } catch (error: unknown) {
            this.reportError(error);
          }
        }
      })
    })
  }

  protected async loadDriver(token: AnalyticsDriverToken): Promise<AnalyticsDriverConstructor> {
    const driverImport = analyticsDrivers.get(token);
    if (typeof driverImport === 'undefined') {
      throw new Error(`[Trackify] Driver ${Symbol.keyFor(token)} not found.`);
    }

    return await driverImport();
  }

  protected reportError(error: unknown): void {
    if (typeof console !== 'undefined' && console.error) {
      console.error(error);
    }
  }
}
