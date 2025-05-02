import { DataSource } from "typeorm";
import { ListStationUseCase } from "../../../../src/application/use-cases/station/ListStationUseCase";
import StationRepository from "../../../../src/infrastructure/repositories/StationRepository";
import { clearDatabase } from "../../config/setup/DatabaseCleaner";
import SetupIntegration, { getDataSource } from "../../config/setup/SetupIntegration";
import { createStationSeed } from "../../config/seeds/createStationSeed";
import { createMeasuresSeed } from "../../config/seeds/createMeasuresSeed";
import { createParameterSeed } from "../../config/seeds/createParameterSeed";
import { createTypeParameterSeed } from "../../config/seeds/createTypeParameterSeed";

let dataSource: DataSource;
let useCase: ListStationUseCase;
let stationRepo: StationRepository;

beforeAll(async () => {
    await SetupIntegration();
    dataSource = getDataSource();
});

beforeEach(async () => {
    await clearDatabase(dataSource);
    stationRepo = new StationRepository();
    useCase = new ListStationUseCase(stationRepo);
});

afterAll(async () => {
    await dataSource.destroy();
});

test('✅ Deve listar todas as estações com data da última medição', async () => {
    const station1 = await createStationSeed();
    const typeParameter = await createTypeParameterSeed();
    const parameter = await createParameterSeed(typeParameter, station1);
    const measure = await createMeasuresSeed(parameter.id); 

    const result = await useCase.execute();

    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(station1.id);
    expect(result[0].name).toBe(station1.name);
    expect(result[0].latitude).toBe(station1.latitude);
    expect(result[0].longitude).toBe(station1.longitude);
    expect(result[0].DateLastMeasure).toBe(measure.unixTime.toString());
}); 

test('❌ Deve retornar uma lista vazia se não houver estações', async () => {
    await expect(useCase.execute()).rejects.toThrow('Nenhuma estação para listar');
});


