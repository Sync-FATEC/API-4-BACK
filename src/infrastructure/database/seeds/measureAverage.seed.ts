import { AppDataSource } from "../data-source";
import { MeasureAverage } from "../../../domain/models/entities/MeasureAverage";
import { Measure } from "../../../domain/models/entities/Measure";
import { v4 as uuidv4 } from 'uuid';
import { Station } from "../../../domain/models/entities/Station";
import { enumAverage } from "../../../domain/enums/MeasureAverage/enumAverage";
import Parameter from "../../../domain/models/agregates/Parameter/Parameter";
import { CreateMeasureAverageUseCase } from "../../../application/use-cases/measureAverage/CreateMeasureAverageUseCase";
import { MeasureAverageRepository } from "../../repositories/MeasureAverageRepository";
import { MeasureRepository } from "../../repositories/MeasureRepository";

export async function seedMeasureAverages() {
    const measureAverageRepository = new MeasureAverageRepository();
    const measureRepository = new MeasureRepository();


    const createMeasureAverageUseCase = new CreateMeasureAverageUseCase(measureAverageRepository, measureRepository);

    await createMeasureAverageUseCase.executeLastHour();
    await createMeasureAverageUseCase.executeLastDay();

    
}