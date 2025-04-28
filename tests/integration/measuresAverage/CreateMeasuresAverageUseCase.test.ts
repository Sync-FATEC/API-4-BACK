import { DataSource } from "typeorm";
import { MeasureRepository } from "../../../src/infrastructure/repositories/MeasureRepository";
import { MeasureAverageRepository } from "../../../src/infrastructure/repositories/MeasureAverageRepository";
import { CreateMeasureAverageUseCase } from "../../../src/application/use-cases/measureAverage/CreateMeasureAverageUseCase";
import SetupIntegration, { getDataSource } from "../config/setup/SetupIntegration";
import { clearDatabase } from "../config/setup/DatabaseCleaner";    
import { createMeasuresAverageSeed } from "../config/seeds/createMeasuresAverageSeed";

let dataSource: DataSource;
let useCase: CreateMeasureAverageUseCase;
let measureAverageRepo: MeasureAverageRepository;
let measureRepo: MeasureRepository;

beforeAll(async () => {
    await SetupIntegration();
    dataSource = getDataSource();
});

beforeEach(async () => {
    await clearDatabase(dataSource);
    measureAverageRepo = new MeasureAverageRepository();
    measureRepo = new MeasureRepository();
    useCase = new CreateMeasureAverageUseCase(measureAverageRepo, measureRepo);
});

afterAll(async () => {
    await dataSource.destroy();
});

test('✅ Deve criar uma média de medições', async () => {
    const measureAverage = await createMeasuresAverageSeed();
    
    expect(measureAverage).toBeDefined();
    expect(Array.isArray(measureAverage)).toBe(true);
    expect(measureAverage.length).toBeGreaterThan(0);

    const average = measureAverage[0];

    expect(average).toBeDefined();
    expect(average.typeAverage).toBe(0);
    expect(average.name).toBe('Temperatura');
    expect(average.value).toEqual(expect.any(String))

    expect(average.station).toBeDefined();
    expect(average.station.id).toEqual(expect.any(String));

    expect(average.id).toEqual(expect.any(String));
    expect(average.createdAt).toBeInstanceOf(Date);
});