import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { ISenderAlertService } from "../../../domain/interfaces/ISenderAlertService";
import { IAlertRepository } from "../../../domain/interfaces/repositories/IAlertRepository";
import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { ITypeAlertRepository } from "../../../domain/interfaces/repositories/ITypeAlertRepository";
import { Alert } from "../../../domain/models/agregates/Alert/Alert";
import { RegisterAlertDTO } from "../../../web/dtos/alert/RegisterAlertDTO";
import { AlertUseCase } from "./AlertUseCase";

export default class RegisterAlertUseCase extends AlertUseCase {
  private senderAlert : ISenderAlertService;

  constructor(
    alertRepository: IAlertRepository,
    typeAlertRepository: ITypeAlertRepository,
    measureRepository: IMeasureRepository,
    senderAlert: ISenderAlertService
  ) {
    super(alertRepository, typeAlertRepository, measureRepository);
    this.senderAlert = senderAlert;
  }

  public async execute(data: RegisterAlertDTO): Promise<Alert> {
    let measure = await this.measureRepository.getById(data.measureId);

    if (measure === null) throw new SystemContextException("Medida não encontrada");

    let typeAlert = await this.typeAlertRepository.findById(data.typeAlerdId);

    if (typeAlert === null) throw new SystemContextException("Tipo de alerta não encontrado");

    let alert = Alert.create(data.date, typeAlert, measure);

    alert = await this.alertRepository.createAlert(alert);

    this.senderAlert.execute(alert, typeAlert, measure);

    return alert;
  }
}
