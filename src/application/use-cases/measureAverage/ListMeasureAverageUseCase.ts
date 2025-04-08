import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IMeasureAverageRepository } from "../../../domain/interfaces/repositories/IMeasureAverageRepository";
import { MeasureAverage } from "../../../domain/models/entities/MeasureAverage";

export default class ListMeasureAverageUseCase {
    constructor(private measureAverageRepository: IMeasureAverageRepository) {}

    async execute(stationId: string): Promise<MeasureAverage[]> {
        const response = await this.measureAverageRepository.listMeasuresAverages(stationId); 

        if (!response) throw new SystemContextException("Nenhuma media de medida para listar") 

        return response;
    }
}