import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IAlertRepository } from "../../../domain/interfaces/repositories/IAlertRepository";
import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { ITypeAlertRepository } from "../../../domain/interfaces/repositories/ITypeAlertRepository";
import { Alert } from "../../../domain/models/agregates/Alert/Alert";
import { RegisterAlertDTO } from "../../../web/dtos/alert/RegisterAlertDTO";
import { AlertUseCase } from "./AlertUseCase";

export default class RegisterAlertUseCase extends AlertUseCase {
  constructor(
    alertRepository: IAlertRepository,
    typeAlertRepository: ITypeAlertRepository,
    measureRepository: IMeasureRepository
  ) {
    super(alertRepository, typeAlertRepository, measureRepository);
  }

  public async execute(data: RegisterAlertDTO): Promise<Alert> {
    let measure = await this.measureRepository.getById(data.measureId);

    if (measure == null) throw new Error("Measure not found");

    let typeAlert = await this.typeAlertRepository.findById(data.typeAlerdId);

    if (typeAlert == null) throw new Error("Type not found");

    let alert = Alert.create(data.date, typeAlert, measure);

    alert = await this.alertRepository.createAlert(alert);

    return alert;
  }
}
