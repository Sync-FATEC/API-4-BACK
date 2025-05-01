import { RunMeasureAverageCron } from './RunMeasureAverageCron';
import { RunTakeMeasuresCron } from './RunTakeMeasuresCron';

export class CronManager {
  private takeMeasuresCron = new RunTakeMeasuresCron();

  async startAll() {
    await this.takeMeasuresCron.execute();
  }

  async stopAll() {
    await this.takeMeasuresCron.stop();
  }
}
