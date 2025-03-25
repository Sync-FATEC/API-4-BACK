import { IStationRepository } from "../../../domain/interfaces/repositories/IStationRepository";
export class ListStationUseCase {
    constructor(private stationRepository: IStationRepository) {}

    async execute() {
        const stations = await this.stationRepository.list();
        if (stations.length === 0) {
            throw new Error('Nenhuma estação para listar');
        }

        return stations;
    }
}