import { IStationRepository } from "../../../domain/models/entities/Station";

export default class DeleteStationUseCase {
    constructor(private stationRepository: IStationRepository) {}

    async execute(id: string) {
        const station = await this.stationRepository.findById(id);
        if (!station) {
            throw new Error('Estação não encontrada');
        }

        return await this.stationRepository.delete(id);
    }
}