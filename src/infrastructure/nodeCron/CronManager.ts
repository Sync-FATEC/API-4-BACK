import { RunMeasureAverageCron } from './RunMeasureAverageCron';
import { RunTakeMeasuresCron } from './RunTakeMeasuresCron';

export class CronManager {
  private takeMeasuresCron = new RunTakeMeasuresCron();
  private measureAverageCron = new RunMeasureAverageCron();

  async startAll() {
    await this.takeMeasuresCron.execute();
    await this.measureAverageCron.execute();
  }
}
