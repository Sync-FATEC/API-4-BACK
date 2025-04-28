import { RegisterMeasureUseCase } from "../../../../src/application/use-cases/measure/RegisterMeasureUseCase";
import { MeasureRepository } from "../../../../src/infrastructure/repositories/MeasureRepository";
import { ParameterRepository } from "../../../../src/infrastructure/repositories/ParameterRepository";
import StationRepository from "../../../../src/infrastructure/repositories/StationRepository";

export async function createMeasuresSeed(parameterId: string) {
    const measureRepository = new MeasureRepository();
    const parameterRepository = new ParameterRepository();
    const stationRepository = new StationRepository();
    const registerMeasureUseCase = new RegisterMeasureUseCase(measureRepository, parameterRepository, stationRepository);

    const unixTime = Math.floor(Date.now() / 1000);
    const value = Math.floor(Math.random() * 100);

    const measures = await registerMeasureUseCase.execute({
        unixTime,
        value,
        parameterId
    });

    return measures;
}



