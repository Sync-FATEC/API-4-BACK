import { DataSource } from 'typeorm';
import { CreateMeasureAverageUseCase } from '../../../src/application/use-cases/measureAverage/CreateMeasureAverageUseCase';
import { MeasureAverageRepository } from '../../../src/infrastructure/repositories/MeasureAverageRepository';
import { MeasureRepository } from '../../../src/infrastructure/repositories/MeasureRepository';
import { runStationSeeds } from '../seeds/stationSeeds';
import { runTypeParameterSeeds } from '../seeds/typeParameterSeeds';
import { runParameterSeeds } from '../seeds/parameterSeeds';
import { runMeasureSeeds } from '../seeds/measureSeeds';
import SetupIntegration, { getDataSource } from '../setup/SetupIntegration';
import { clearDatabase } from '../setup/DatabaseCleaner';
import request from 'supertest';
import { app } from '../../../src/server';

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

describe('Testes de Integração para ler média de medidas - /measureAverage', () => {
  test('✅ Deve retornar status 200 e a lista de media de medidas', async () => {
    const stations = await runStationSeeds(dataSource);
    const typeParameters = await runTypeParameterSeeds(dataSource);
    const parameters = await runParameterSeeds(dataSource, stations, typeParameters);
    await runMeasureSeeds(dataSource, parameters);

    // Gera médias para os testes
    await useCase.executeLastHour();

    const response = await request(app).get('/measureAverage/public/' + stations[1].id);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(200);
    expect(Array.isArray(response.body.model)).toBe(true);
    expect(response.body.model.length).toBeGreaterThan(0);
  });

  test('❌ Deve retornar status 400 caso a estação nao exista', async () => {
    const nonExistingStationId = '12345678-1234-1234-1234-123456789012';
    const response = await request(app).get('/measureAverage/public/' + nonExistingStationId);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(400);
    expect(response.body.error).toBe("Estação não encontrada");
  });

  test('❌ Deve retornar status 400 caso não haja media de medidas', async () => {
    const stations = await runStationSeeds(dataSource);

    const response = await request(app).get('/measureAverage/public/' + stations[0].id);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(400);
    expect(response.body.error).toBe("Nenhuma media de medida para listar");
  });
});