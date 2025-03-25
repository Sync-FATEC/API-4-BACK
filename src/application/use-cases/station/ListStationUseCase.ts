import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IStationRepository } from "../../../domain/models/entities/Station";

export class ListStationUseCase {
    constructor(private stationRepository: IStationRepository) {}

    async execute() {
        const stations = await this.stationRepository.list();
        if (stations.length === 0) {
            throw new SystemContextException('Nenhuma estação para listar');
        }

        return stations;
    }
}