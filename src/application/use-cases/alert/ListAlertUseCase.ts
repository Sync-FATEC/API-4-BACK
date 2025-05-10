import { IAlertRepository } from "../../../domain/interfaces/repositories/IAlertRepository";
import { ListAlertDTO } from "../../../web/dtos/alert/ListAlertDTO";

export class ListAlertUseCase {
    constructor(private alertRepository: IAlertRepository) {}

    async execute(stationId : string | null): Promise<ListAlertDTO[]> {
        return await this.alertRepository.getAllAlerts(stationId);
    }
}