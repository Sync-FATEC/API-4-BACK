import { IAlertRepository } from "@/domain/interfaces/repositories/IAlertRepository";
import { Alert } from "@/domain/models/agregates/Alert/Alert";

export class ListAlertUseCase {
    constructor(private alertRepository: IAlertRepository) {}

    async execute(): Promise<Alert[]> {
        return await this.alertRepository.getAllAlerts();
    }
}