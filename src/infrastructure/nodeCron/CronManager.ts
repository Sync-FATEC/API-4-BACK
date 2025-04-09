import { RunMeasureAverageCron } from './RunMeasureAverageCron';
import { RunTakeMeasuresCron } from './RunTakeMeasuresCron';

export class CronManager {
  private takeMeasuresCron = new RunTakeMeasuresCron();
  private measureAverageCron = new RunMeasureAverageCron();

  async startAll() {
    if (process.env.NODE_ENV === 'test') return;
    await this.takeMeasuresCron.execute();
    await this.measureAverageCron.execute();
  }

  async stopAll() {
    await this.takeMeasuresCron.stop();
    await this.measureAverageCron.stopTasks();
  }
}
