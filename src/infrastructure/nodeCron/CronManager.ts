import { RunMeasureAverageCron } from './RunMeasureAverageCron';
import { RunTakeMeasuresCron } from './RunTakeMeasuresCron';
import { NotificationService } from '../websocket/service/NotificationService';

export class CronManager {
  private takeMeasuresCron: RunTakeMeasuresCron;
  private measureAverageCron = new RunMeasureAverageCron();

  constructor(notificationService: NotificationService) {
    this.takeMeasuresCron = new RunTakeMeasuresCron(notificationService);
  }

  async startAll() {
    await this.takeMeasuresCron.execute();
    await this.measureAverageCron.execute();
  }

  async stopAll() {
    await this.takeMeasuresCron.stop();
    await this.measureAverageCron.stop();
  }
}
