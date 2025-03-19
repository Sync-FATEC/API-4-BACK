import { IStationRepository } from "@/domain/models/entities/Station";
import a from "@/web/dtos/station/CreateStationDTO";

export class CreateStationUseCase {
  constructor(private stationRepository: IStationRepository) {}

  async execute(stationData: a) {
    return await this.stationRepository.create({
      name: stationData.getName(),
      latitude: stationData.getLatitude(),
      longitude: stationData.getLongitude(),
      altitude: stationData.getAltitude(),
    });
  }
}
