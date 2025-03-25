import { IAlertRepository } from "../../../domain/interfaces/repositories/IAlertRepository";
import { ITypeAlertRepository } from "../../../domain/interfaces/repositories/ITypeAlertRepository";
import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";

export class AlertUseCase {
    protected alertRepository: IAlertRepository;
    protected typeAlertRepository: ITypeAlertRepository;
    protected measureRepository: IMeasureRepository;

    constructor(
        alertRepository: IAlertRepository,
        typeAlertRepository: ITypeAlertRepository,
        measureRepository: IMeasureRepository
    ) {
        this.alertRepository = alertRepository;
        this.typeAlertRepository = typeAlertRepository;
        this.measureRepository = measureRepository;
    }
}
