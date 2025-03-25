import { RegisterAlertDTO } from "@/web/dtos/alert/RegisterAlertDTO";
import { AlertUseCase } from "./AlertUseCase";
import { IAlertRepository } from "@/domain/interfaces/repositories/IAlertRepository";
import { ITypeAlertRepository } from "@/domain/interfaces/repositories/ITypeAlertRepository";
import { IMeasureRepository } from "@/domain/interfaces/repositories/IMeasureRepository";
import { SystemContextException } from "@/domain/exceptions/SystemContextException";
import { Alert } from "@/domain/models/agregates/Alert/Alert";

export class RegisterAlertUseCase extends AlertUseCase {

    private measureRepository : IMeasureRepository;

    constructor(alertRepository: IAlertRepository, typeAlertRepository: ITypeAlertRepository) {
        super(alertRepository, typeAlertRepository);
    }

    public async execute(data: RegisterAlertDTO): Promise<Alert> {

        let measure = await this.measureRepository.getMeasureById(data.measureId);

        if(measure == null) throw new Error('Measure not found');

        let typeAlert = await this.typeAlertRepository.findById(data.typeAlerdId);  

        if(typeAlert == null) throw new Error('Type not found');

        let alert = Alert.create(data.date, typeAlert, measure);

        alert = await this.alertRepository.createAlert(alert);

        return alert;
    }
}

