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

beforeAll(async () => {
  await SetupIntegration();
});

beforeEach(async () => {
  dataSource = getDataSource();
  await clearDatabase(dataSource);
});

describe('Testes de Integração para ler média de medidas - /measure/average', () => {
  test('✅ Deve retornar status 200 e a lista de media de medidas', async () => {
    const stations = await runStationSeeds(dataSource);
    const typeParameters = await runTypeParameterSeeds(dataSource);
    const parameters = await runParameterSeeds(dataSource, stations, typeParameters);
    await runMeasureSeeds(dataSource, parameters);

    const measureAverageRepo = new MeasureAverageRepository();

    useCase = new CreateMeasureAverageUseCase(
      measureAverageRepo,
      new MeasureRepository()
    );

    await useCase.executeLastHour();

    const response = await request(app).get('/measureAverage/' + stations[1].id);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(200);
    expect(Array.isArray(response.body.model)).toBe(true);

  });

  test('❌ Deve retornar status 400 caso a estação nao exista', async () => {
    const response = await request(app).get('/measureAverage/' + '12345678-1234-1234-1234-123456789012');

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(400);
    expect(response.body.error).toBe("Estação não encontrada");
  }
  );

  test('❌ Deve retornar status 400 caso não haja media de medidas', async () => {
    const stations = await runStationSeeds(dataSource);

    const response = await request(app).get('/measureAverage/' + stations[0].id);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(400);
    expect(response.body.error).toBe("Nenhuma media de medida para listar");
  });
});