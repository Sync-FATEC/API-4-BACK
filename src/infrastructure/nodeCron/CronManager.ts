import { RunTakeMeasuresCron } from "./RunTakeMeasuresCron";
import { NotificationService } from "../websocket/service/NotificationService";

export class CronManager {
  private takeMeasuresCron: RunTakeMeasuresCron;

  constructor(notificationService: NotificationService) {
    this.takeMeasuresCron = new RunTakeMeasuresCron(notificationService);
  }

  async startAll() {
    await this.takeMeasuresCron.execute();
  }

  async stopAll() {
    await this.takeMeasuresCron.stop();
  }
}
