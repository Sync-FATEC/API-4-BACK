import { MeasureAverageRepository } from "../../../../src/infrastructure/repositories/MeasureAverageRepository";

import { CreateMeasureAverageUseCase } from "../../../../src/application/use-cases/measureAverage/CreateMeasureAverageUseCase";
import { MeasureRepository } from "../../../../src/infrastructure/repositories/MeasureRepository";
import { createTypeParameterSeed } from "./createTypeParameterSeed";
import { createParameterSeed } from "./createParameterSeed";
import { createStationSeed } from "./createStationSeed";
import { createMeasuresSeed } from "./createMeasuresSeed";

export async function createMeasuresAverageSeed() {
    const measureAverageRepository = new MeasureAverageRepository();
    const measureRepository = new MeasureRepository();
    const createMeasureAverageUseCase = new CreateMeasureAverageUseCase(measureAverageRepository, measureRepository);

    const station = await createStationSeed();
    const typeParameter = await createTypeParameterSeed();
    const parameter = await createParameterSeed(typeParameter, station);
    await createMeasuresSeed(parameter.id);
    await createMeasuresSeed(parameter.id);
    await createMeasuresSeed(parameter.id);
    await createMeasuresSeed(parameter.id);
    await createMeasuresSeed(parameter.id);
    await createMeasuresSeed(parameter.id);
    await createMeasuresSeed(parameter.id);
    await createMeasuresSeed(parameter.id);

    const measureAverage = await createMeasureAverageUseCase.executeLastHour();
    return measureAverage;
}

