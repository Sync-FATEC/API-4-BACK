import { IAlertRepository } from "src/domain/interfaces/repositories/IAlertRepository";
import { ITypeAlertRepository } from "src/domain/interfaces/repositories/ITypeAlertRepository";


export abstract class AlertUseCase {
    protected alertRepository: IAlertRepository;
    protected typeAlertRepository: ITypeAlertRepository;

    constructor(alertRepository: IAlertRepository, typeAlertRepository: ITypeAlertRepository) {
        this.alertRepository = alertRepository;
        this.typeAlertRepository = typeAlertRepository;
    }
}