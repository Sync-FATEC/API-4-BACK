import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IStationRepository } from "../../../domain/interfaces/repositories/IStationRepository";
import { Station } from "../../../domain/models/entities/Station";
import UpdateStationDTO from "../../../web/dtos/station/UpdateStationDTO";

export default class UpdateStationUseCase {
    constructor(private stationRepository: IStationRepository) {}

    async execute(stationData: UpdateStationDTO) {
        const station = await this.stationRepository.findById(stationData.getId());
        if (!station) {
            throw new SystemContextException('Estação não encontrada');
        }

        const updateData: Partial<Station> = {
            name: stationData.getName(),
            latitude: stationData.getLatitude(),
            longitude: stationData.getLongitude(),
        }
        if (stationData.getUuid() != station.uuid) {
            updateData.uuid = stationData.getUuid();
        }
        
        await this.stationRepository.update(station.id, updateData);
    }
}