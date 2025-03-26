import { IAlertRepository } from "../../../domain/interfaces/repositories/IAlertRepository";
import { Alert } from "../../../domain/models/agregates/Alert/Alert";

export class ReadAlertUseCase {
    constructor(private alertRepository: IAlertRepository) {}

    async execute(id: string): Promise<Alert> {
        return await this.alertRepository.getAlertById(id);
    }
}