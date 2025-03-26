import { IAlertRepository } from "../../../domain/interfaces/repositories/IAlertRepository";
import { AlertUseCase } from "./AlertUseCase";

export class DeleteAlertUseCase extends AlertUseCase {
    constructor(alertRepository: IAlertRepository) {
        super(alertRepository, null, null);
    }

    async execute(id: string): Promise<void> {
        await this.alertRepository.deleteAlert(id);
    }
}
