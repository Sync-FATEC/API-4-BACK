import { randomUUID } from "crypto";

import CreateStationDTO from "../../../../src/web/dtos/station/CreateStationDTO";

import { CreateStationUseCase } from "../../../../src/application/use-cases/station/CreateStationUseCase";

import StationRepository from "../../../../src/infrastructure/repositories/StationRepository";

export async function createStationSeed() {
    const stationRepository = new StationRepository();
    const createStationUseCase = new CreateStationUseCase(stationRepository);

    const stationDTO = new CreateStationDTO(
        'Estação Centro',
        randomUUID(),
        '-23.5505',
        '-46.6333'
    );

    const station = await createStationUseCase.execute(stationDTO);

    return station;
}

