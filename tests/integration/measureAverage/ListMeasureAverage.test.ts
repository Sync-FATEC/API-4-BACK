import { DataSource } from 'typeorm';
import ListMeasureAverageUseCase from '../../../src/application/use-cases/measureAverage/ListMeasureAverageUseCase';
import { MeasureAverageRepository } from '../../../src/infrastructure/repositories/MeasureAverageRepository';
import { MeasureRepository } from '../../../src/infrastructure/repositories/MeasureRepository';
import { runStationSeeds } from '../seeds/stationSeeds';
import { runTypeParameterSeeds } from '../seeds/typeParameterSeeds';
import { runParameterSeeds } from '../seeds/parameterSeeds';
import { runMeasureSeeds } from '../seeds/measureSeeds';
import SetupIntegration, { getDataSource } from '../setup/SetupIntegration';
import request from 'supertest';
import { app } from '../../../src/server';
import { enumAverage } from '../../../src/domain/enums/MeasureAverage/enumAverage';
import { CreateMeasureAverageUseCase } from '../../../src/application/use-cases/measureAverage/CreateMeasureAverageUseCase';

let dataSource: DataSource;
let listUseCase: ListMeasureAverageUseCase;
let createUseCase: CreateMeasureAverageUseCase;
let measureAverageRepository: MeasureAverageRepository;
let measureRepository: MeasureRepository;
let stationId: string;

beforeAll(async () => {
  await SetupIntegration();
});

beforeEach(async () => {
  dataSource = getDataSource();
  await dataSource.synchronize(true);
});

describe('Testes de Integração para listar médias de medidas - /measureAverage/:stationId', () => {
  test('✅ Deve listar médias de medidas com banco real', async () => {
    // Criar dados de teste usando seeds
    const stations = await runStationSeeds(dataSource);
    const typeParameters = await runTypeParameterSeeds(dataSource);
    const parameters = await runParameterSeeds(dataSource, stations, typeParameters);
    await runMeasureSeeds(dataSource, parameters);

    // Guardar o ID da primeira estação para usar nos testes
    stationId = stations[0].id;

    // Inicializar repositórios e casos de uso
    measureAverageRepository = new MeasureAverageRepository();
    measureRepository = new MeasureRepository();

    listUseCase = new ListMeasureAverageUseCase(measureAverageRepository);
    createUseCase = new CreateMeasureAverageUseCase(
      measureAverageRepository,
      measureRepository
    );

    // Criar médias para ter dados para listar
    await createUseCase.executeLastHour();
    // Executar o caso de uso diretamente
    const measures = await listUseCase.execute(stationId);

    // Verificar se retornou as médias corretamente
    expect(measures).toBeDefined();
    expect(measures.length).toBeGreaterThan(0);

    // Verificar se as médias têm os campos esperados
    const firstMeasure = measures[0];
    expect(firstMeasure).toHaveProperty('id');
    expect(firstMeasure).toHaveProperty('typeAverage');
    expect(firstMeasure).toHaveProperty('name');
    expect(firstMeasure).toHaveProperty('value');
    expect(firstMeasure).toHaveProperty('createdAt');

    // Verificar se há médias para a estação Centro
    const temperatureMeasure = measures.find(m => m.name.includes('Temperatura'));
    expect(temperatureMeasure).toBeDefined();
    expect(parseFloat(temperatureMeasure!.value)).toBeCloseTo(25.2, 1);
  });

  test('✅ Deve retornar status 200 e lista de médias de medidas via API', async () => {
    const response = await request(app).get(`/measureAverage/${stationId}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(200);
    expect(Array.isArray(response.body.model)).toBe(true);
    expect(response.body.model.length).toBeGreaterThan(0);

    // Verificar se as médias estão na resposta
    const measureNames = response.body.model.map((measure: any) => measure.name);
    expect(measureNames.some((name: string) => name.includes('Temperatura'))).toBe(true);
    expect(measureNames.some((name: string) => name.includes('Umidade'))).toBe(true);
    expect(measureNames.some((name: string) => name.includes('Pressão'))).toBe(true);
  });

  test('❌ Deve retornar status 400 caso não existam médias de medidas', async () => {
    // Limpar todas as médias do banco
    await dataSource.getRepository('MeasureAverage').clear();

    const response = await request(app).get(`/measureAverage/${stationId}`);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(400);
    expect(response.body.model).toBeNull();
    expect(response.body.error).toBe("Nenhuma media de medida para listar");
  });
});