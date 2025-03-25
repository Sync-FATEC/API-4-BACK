import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IStationRepository, Station } from "../../../domain/models/entities/Station";

export class ReadStationUseCase {
    constructor(private stationRepository: IStationRepository) {}

    async execute(id: string): Promise<Station | null> {
        const station = await this.stationRepository.findById(id);
        if (!station) {
            throw new SystemContextException('Estação não encontrada');
        }

        return station;
    }
}