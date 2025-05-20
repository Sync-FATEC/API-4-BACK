import CreateStationDTO from "../../../../src/web/dtos/station/CreateStationDTO";

import { CreateStationUseCase } from "../../../../src/application/use-cases/station/CreateStationUseCase";

import StationRepository from "../../../../src/infrastructure/repositories/StationRepository";

export async function createStationSeed(name: string, uuid: string, lat: string, log: string) {
    const stationRepository = new StationRepository();
    const createStationUseCase = new CreateStationUseCase(stationRepository);

    const stationDTO = new CreateStationDTO(
        name,
        uuid,
        lat,
        log,
    );

    const station = await createStationUseCase.execute(stationDTO);

    return station;
}

