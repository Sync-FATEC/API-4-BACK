import { IAlertRepository } from "../../../domain/interfaces/repositories/IAlertRepository";
import { Alert } from "../../../domain/models/agregates/Alert/Alert";
import { ListAlertDTO } from "../../../web/dtos/alert/ListAlertDTO";

export class ListAlertUseCase {
    constructor(private alertRepository: IAlertRepository) {}

    async execute(): Promise<ListAlertDTO[]> {
        return await this.alertRepository.getAllAlerts();
    }
}