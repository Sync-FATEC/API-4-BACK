import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { IAlertRepository } from "src/domain/interfaces/repositories/IAlertRepository";
import { Alert } from "src/domain/models/agregates/Alert/Alert";

export class AlertRepository implements IAlertRepository {
  private alerts: Repository<Alert> = AppDataSource.getRepository(Alert);

  async createAlert(alert: Alert): Promise<Alert> {
    return await this.alerts.save(alert);
  }

  async getAlertById(id: string): Promise<Alert | null> {
    const alert = await this.alerts.findOne({ where: { id } });
    return alert || null;
  }

  async getAllAlerts(): Promise<Alert[]> {
    return await this.alerts.find();
  }

  async deleteAlert(id: string): Promise<boolean> {
    const result = await this.alerts.delete(id);
    return result.affected !== 0;
  }
}
