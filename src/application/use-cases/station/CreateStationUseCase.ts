import CreateStationDTO from "../../../web/dtos/station/CreateStationDTO";
import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IStationRepository } from "../../../domain/interfaces/repositories/IStationRepository";

export class CreateStationUseCase {
  constructor(private stationRepository: IStationRepository) {}

  async execute(stationData: CreateStationDTO): Promise<any> {
    const station = await this.stationRepository.findByUuid(stationData.getUuid());
    if (station) {
      throw new SystemContextException("UUID de estação já cadastrada");
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
