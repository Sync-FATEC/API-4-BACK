import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IMeasureAverageRepository } from "../../../domain/interfaces/repositories/IMeasureAverageRepository";
import { IStationRepository } from "../../../domain/interfaces/repositories/IStationRepository";
import { MeasureAverage } from "../../../domain/models/entities/MeasureAverage";

export default class ListMeasureAverageUseCase {
    constructor(
        private measureAverageRepository: IMeasureAverageRepository,
        private stationRepository: IStationRepository
    ) {}

    async execute(stationId: string): Promise<MeasureAverage[]> {
        const station = await this.stationRepository.findById(stationId);

        if (!station) throw new SystemContextException("Estação não encontrada")

        const response = await this.measureAverageRepository.listMeasuresAverages(stationId); 

        if (response.length == 0) throw new SystemContextException("Nenhuma media de medida para listar") 

        return response;
    }
}