import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IStationRepository } from "../../../domain/interfaces/repositories/IStationRepository";

export class ListStationUseCase {
    constructor(private stationRepository: IStationRepository) {}

    async execute(): Promise<any> {
        const stations = await this.stationRepository.list();
        if (stations.length === 0) {
            throw new SystemContextException('Nenhuma estação para listar');
        }

        return stations;
    }
}