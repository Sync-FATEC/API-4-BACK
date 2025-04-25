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

        const response = await this.measureAverageRepository.listMeasuresAveragesLast7Days(stationId);

        if (response.length == 0) throw new SystemContextException("Nenhuma media de medida para listar") 

        return response;
    }

    async executeWithStartAndEnd(stationId: string, start: string, end: string): Promise<MeasureAverage[]> {
        const station = await this.stationRepository.findById(stationId);

        if (!station) throw new SystemContextException("Estação não encontrada")

        const startDate = new Date(start);
        const endDate = new Date(end);

        const response = await this.measureAverageRepository.listMeasuresAveragesWithStartAndEnd(stationId, startDate, endDate);

        if (response.length == 0) throw new SystemContextException("Nenhuma media de medida para listar") 

        return response;
    }

    async executeWithDate(stationId: string, date: string): Promise<MeasureAverage[]> {
        const station = await this.stationRepository.findById(stationId);

        if (!station) throw new SystemContextException("Estação não encontrada")

        const dateObj = new Date(date);
        
        const response = await this.measureAverageRepository.listMeasuresAveragesWithDate(stationId, dateObj);

        if (response.length == 0) throw new SystemContextException("Nenhuma media de medida para esta data")

        return response;
    }
}