import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IAlertRepository } from "../../../domain/interfaces/repositories/IAlertRepository";
import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { ITypeAlertRepository } from "../../../domain/interfaces/repositories/ITypeAlertRepository";
import { Alert } from "../../../domain/models/agregates/Alert/Alert";
import { UpdateAlertDTO } from "../../../web/dtos/alert/UpdateAlertDTO";
import { AlertUseCase } from "./AlertUseCase";

export class UpdateAlertUseCase extends AlertUseCase {
    constructor(alertRepository: IAlertRepository, typeAlertRepository: ITypeAlertRepository, measureRepository: IMeasureRepository) {
        super(alertRepository, typeAlertRepository, measureRepository);
    }

    public async execute(data: UpdateAlertDTO): Promise<void> {
        let typeAlert = await this.typeAlertRepository.findById(data.typeId);
        let measure = await this.measureRepository.getById(data.measureId);

        if (!typeAlert) {
            throw new SystemContextException('Tipo de alerta não encontrado');
        }

        if (!measure) {
            throw new SystemContextException('Medida não encontrada');
        }

        let alert = Alert.create(data.date, typeAlert, measure);
        await this.alertRepository.updateAlert(alert);
    }
}