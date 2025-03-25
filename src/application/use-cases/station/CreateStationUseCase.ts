import { create } from "domain";
import CreateStationDTO from "../../../web/dtos/station/CreateStationDTO";
import { IStationRepository } from "../../../domain/interfaces/repositories/IStationRepository";

export class CreateStationUseCase {
  constructor(private stationRepository: IStationRepository) {}

  async execute(stationData: CreateStationDTO) {
    const station = await this.stationRepository.findByUuid(stationData.getUuid());
    if (station) {
      throw new Error("UUID de estação já cadastrada");
    }

    return await this.stationRepository.create({
      name: stationData.getName(),
      uuid: stationData.getUuid(),
      latitude: stationData.getLatitude(),
      longitude: stationData.getLongitude(),
      createdAt: new Date(),
    });
  }
}
