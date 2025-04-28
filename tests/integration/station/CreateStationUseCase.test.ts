import { DataSource } from "typeorm";
import { CreateStationUseCase } from "../../../src/application/use-cases/station/CreateStationUseCase";
import StationRepository from "../../../src/infrastructure/repositories/StationRepository";
import SetupIntegration, { getDataSource } from "../config/setup/SetupIntegration";
import { clearDatabase } from "../config/setup/DatabaseCleaner";
import { createStationSeed } from "../config/seeds/createStationSeed";
import CreateStationDTO from "../../../src/web/dtos/station/CreateStationDTO";

let dataSource: DataSource;
let useCase: CreateStationUseCase;
let stationRepo: StationRepository;

beforeAll(async () => {
    await SetupIntegration();
    dataSource = getDataSource();
});

beforeEach(async () => {
    await clearDatabase(dataSource);
    stationRepo = new StationRepository();
    useCase = new CreateStationUseCase(stationRepo);
});

afterAll(async () => {
    await dataSource.destroy();
}); 

test('✅ Deve criar uma estação', async () => {
    const station = await createStationSeed();
    expect(station).toBeDefined();
    expect(station.id).toBeDefined();
    expect(station.name).toBe('Estação Centro');
    expect(station.latitude).toBe('-23.5505');
    expect(station.longitude).toBe('-46.6333');
});

test('❌ Deve retornar um erro ao criar uma estação com o uuid já existente', async () => {
    const station = await createStationSeed();
    const stationDTO = new CreateStationDTO(
        station.name,
        station.uuid,
        station.latitude,
        station.longitude
    );
    await expect(useCase.execute(stationDTO)).rejects.toThrow('UUID de estação já cadastrada');
});
