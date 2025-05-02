import { DataSource } from "typeorm";
import { RegisterMeasureUseCase } from "../../../../src/application/use-cases/measure/RegisterMeasureUseCase";
import { MeasureRepository } from "../../../../src/infrastructure/repositories/MeasureRepository";
import { ParameterRepository } from "../../../../src/infrastructure/repositories/ParameterRepository";
import StationRepository from "../../../../src/infrastructure/repositories/StationRepository";
import SetupIntegration, { getDataSource } from "../../config/setup/SetupIntegration";
import { clearDatabase } from "../../config/setup/DatabaseCleaner";
import { createParameterSeed } from "../../config/seeds/createParameterSeed";
import { createStationSeed } from "../../config/seeds/createStationSeed";
import { createTypeParameterSeed } from "../../config/seeds/createTypeParameterSeed";
import { createMeasuresSeed } from "../../config/seeds/createMeasuresSeed";

let dataSource: DataSource;
let useCase: RegisterMeasureUseCase;
let measureRepo: MeasureRepository;
let parameterRepo: ParameterRepository;
let stationRepo: StationRepository;

beforeAll(async () => {
    await SetupIntegration();
    dataSource = getDataSource();
});

beforeEach(async () => {
    await clearDatabase(dataSource);
    measureRepo = new MeasureRepository();
    parameterRepo = new ParameterRepository();
    stationRepo = new StationRepository();
    useCase = new RegisterMeasureUseCase(measureRepo, parameterRepo, stationRepo);
});

afterAll(async () => {
    await dataSource.destroy();
});

test('✅ Deve criar uma medição', async () => {
    const station = await createStationSeed();
    const typeParameter = await createTypeParameterSeed();
    const parameter = await createParameterSeed(typeParameter, station);
    const measure = await createMeasuresSeed(parameter.id);
    expect(measure).toBeDefined();
    expect(measure.parameter.id).toBe(parameter.id);
    expect(measure.parameter.idTypeParameter).toEqual(typeParameter);
    expect(measure.parameter.idStation).toEqual(station);
    expect(measure.parameter.idTypeParameter.name).toBe(typeParameter.name);
    expect(measure.unixTime).toBe(measure.unixTime);
    expect(measure.value).toBe(measure.value);
});

test('❌ Deve retornar um erro ao criar uma medição com um parâmetro não existente', async () => {
    await expect(
        createMeasuresSeed('2bc8680a-8ecf-46db-bc63-90a0925eb66b')
    ).rejects.toThrow("Parametro não encontrado");
});










