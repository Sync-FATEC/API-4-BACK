import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { IAlertRepository } from "../../../src/domain/interfaces/repositories/IAlertRepository";
import { Alert } from "../../../src/domain/models/agregates/Alert/Alert";
import { ListAlertDTO } from "../../web/dtos/alert/ListAlertDTO";
import { ListMeasureResponseDTO } from "../../web/dtos/measure/ListMeasureDTO";

export class AlertRepository implements IAlertRepository {
  private alerts: Repository<Alert> = AppDataSource.getRepository(Alert);

  async createAlert(alert: Alert): Promise<Alert> {
    return await this.alerts.save(alert);
  }

  async getAlertById(id: string): Promise<Alert | null> {
    const alert = await this.alerts.findOne({ where: { id } });
    return alert || null;
  }

  async getAllAlerts(stationId: string | null): Promise<ListAlertDTO[]> {
    let alert: Alert[];
    if (stationId) {
      alert = await this.alerts.find({
        where: { measure: { parameter: { idStation: { id: stationId } } } },
        relations: [
          "type",
          "measure.parameter.idTypeParameter",
          "measure.parameter.idStation",
        ],
      });
      
    } else {
      alert = await this.alerts.find({
        relations: [
          "type",
          "measure.parameter.idTypeParameter",
          "measure.parameter.idStation",
        ],
      });
    }
    return alert.map(
      (alert) =>
        ({
          id: alert.id,
          message: alert.type.name,
          measure: {
            id: alert.measure.id,
            unixTime: alert.measure.unixTime,
            value: alert.measure.value + " " + alert.measure.parameter.idTypeParameter.unit,
            parameterText: alert.measure.parameter.getParameterName(),
            criticality: alert.type.criticality,
          } as ListMeasureResponseDTO,
        } as ListAlertDTO)
    );
  }

  async deleteAlert(id: string): Promise<boolean> {
    const result = await this.alerts.delete(id);
    return result.affected !== 0;
  }

  async updateAlert(alert: Alert): Promise<Alert> {
    return await this.alerts.save(alert);
  }
}
