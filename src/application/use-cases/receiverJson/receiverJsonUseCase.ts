import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { ISenderAlertService } from "../../../domain/interfaces/ISenderAlertService";
import { IAlertRepository } from "../../../domain/interfaces/repositories/IAlertRepository";
import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { IParameterRepository } from "../../../domain/interfaces/repositories/IParameterRepository";
import { IStationRepository } from "../../../domain/interfaces/repositories/IStationRepository";
import { ITypeAlertRepository } from "../../../domain/interfaces/repositories/ITypeAlertRepository";
import { RegisterAlertDTO } from "../../../web/dtos/alert/RegisterAlertDTO";
import { RegisterMeasureDTO } from "../../../web/dtos/measure/RegisterMesureDTO";
import RegisterAlertUseCase from "../alert/RegisterAlertUseCase";
import { RegisterMeasureUseCase } from "../measure/RegisterMeasureUseCase";

export default class ReceiverJsonUseCase {
    constructor(
        private stationRepository: IStationRepository,
        private alertRepository: IAlertRepository,
        private typeAlertRepository: ITypeAlertRepository,
        private measureRepository: IMeasureRepository,
        private parameterRepository: IParameterRepository,
        private senderAlert: ISenderAlertService
    ) {}

    async execute(dataJson: any) {
        const { uid, unixtime, _id, ...measurements } = dataJson;
        if (!uid || !unixtime) {
            throw new SystemContextException("Dados inválidos");
        }

        const station = await this.stationRepository.findByUuid(uid);
        if (!station) {
            throw new SystemContextException("Estação não encontrada");
        }

        const registerMeasureUseCase = new RegisterMeasureUseCase(this.measureRepository, this.parameterRepository, this.stationRepository);
        const registerAlertUseCase = new RegisterAlertUseCase(this.alertRepository, this.typeAlertRepository, this.measureRepository, this.senderAlert);

        for (const [key, value] of Object.entries(measurements)) {
            const parameter = station.parameters.find(p => p.idTypeParameter.typeJson === key);
            if (!parameter) {
                throw new SystemContextException(`Tipo de dado não encontrado: ${key}`);
            }

            const measureData: RegisterMeasureDTO = {
                unixTime: unixtime,
                value: Number(value),
                parameterId: parameter.id
            };

            const measure = await registerMeasureUseCase.execute(measureData);
            if (measure?.value == null) continue;

            for (const typeAlert of parameter.typeAlerts) {
                if (this.shouldTriggerAlert(measure.value, typeAlert.comparisonOperator, typeAlert.value)) {
                    const alertData: RegisterAlertDTO = {
                        date: unixtime,
                        typeAlerdId: typeAlert.id,
                        measureId: measure.id
                    };
                    await registerAlertUseCase.execute(alertData);
                }
            }
        }
    }

    private shouldTriggerAlert(measureValue: number, operator: string, threshold: number): boolean {
        switch (operator) {
            case "<": return measureValue < threshold;
            case ">": return measureValue > threshold;
            case "=": return measureValue === threshold;
            default: return false;
        }
    }
}
