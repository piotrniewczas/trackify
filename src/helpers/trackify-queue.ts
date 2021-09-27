import {AnalyticsQueue} from "../interfaces/analytics-queue";
import {AnalyticsEvent} from "../interfaces/analytics-event";

export class TrackifyQueue implements AnalyticsQueue {
  protected state = {
    canRun: false,
    processing: false
  };

  protected runCallback!: (event: AnalyticsEvent) => void;

  protected eventQueue: AnalyticsEvent[] = [];

  onProcessed(callback: (event: AnalyticsEvent) => void): void {
    this.runCallback = callback;
  }

  push(event: AnalyticsEvent): void {
    this.eventQueue.push(event);

    this.process();
  }

  run (): void {
    this.state.canRun = true;

    this.process();
  }

  protected async process(): Promise<void> {
    if (this.eventQueue.length === 0) {
      return;
    }

    if (!this.state.canRun || this.state.processing) {
      return;
    }

    this.state.processing = true;

    const event = this.eventQueue.shift();
    if (typeof event === 'undefined') {
      return;
    }

    if (this.runCallback) {
      this.runCallback.call({}, event);
    }

    this.state.processing = false;
    this.process();
  }
}
