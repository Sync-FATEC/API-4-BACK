import { IStationRepository } from "@/domain/models/entities/Station";
import UpdateStationDTO from "@/web/dtos/station/UpdateStationDTO";

export default class UpdateStationUseCase {
    constructor(private stationRepository: IStationRepository) {}

    async execute(stationData: UpdateStationDTO) {
        const station = await this.stationRepository.findById(stationData.getId());
        if (!station) {
            throw new Error('Estação não encontrada');
        }

        return await this.stationRepository.update(stationData.getId(), {
            name: stationData.getName(),
            latitude: stationData.getLatitude(),
            longitude: stationData.getLongitude(),
            altitude: stationData.getAltitude()
        });
    }
}