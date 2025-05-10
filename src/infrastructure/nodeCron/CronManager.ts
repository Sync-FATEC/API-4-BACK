import { RunTakeMeasuresCron } from './RunTakeMeasuresCron';

export class CronManager {
  private takeMeasuresCron = new RunTakeMeasuresCron();

  async startAll(): Promise<void> {
    await this.takeMeasuresCron.execute();
  }

  async stopAll(): Promise<void> {
    await this.takeMeasuresCron.stop();
  }
}
