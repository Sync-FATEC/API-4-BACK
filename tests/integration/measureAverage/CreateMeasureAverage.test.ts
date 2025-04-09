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

let dataSource: DataSource;
let useCase: CreateMeasureAverageUseCase;

beforeAll(async () => {
  await SetupIntegration();
});

beforeEach(async () => {
  dataSource = getDataSource();
  await clearDatabase(dataSource);
});

test('✅ Deve calcular e salvar médias por hora com banco real', async () => {
  const stations = await runStationSeeds(dataSource);
  const typeParameters = await runTypeParameterSeeds(dataSource);
  const parameters = await runParameterSeeds(dataSource, stations, typeParameters);
  await runMeasureSeeds(dataSource, parameters);

  const measureAverageRepo = new MeasureAverageRepository();

  useCase = new CreateMeasureAverageUseCase(
    measureAverageRepo,
    new MeasureRepository()
  );

  const result = await useCase.executeLastHour();

  expect(result.length).toBe(15);

  // Utilitários para buscar médias por nome
  const getAvgByName = (name: string) => result.find((avg) => avg.name.includes(name));

  // Estação Norte
  expect(parseFloat(getAvgByName('Estação Norte - Temperatura')!.value)).toBeCloseTo(25.20);
  expect(parseFloat(getAvgByName('Estação Norte - Umidade')!.value)).toBeCloseTo(65.04);
  expect(parseFloat(getAvgByName('Estação Norte - Pressão')!.value)).toBeCloseTo(1012.96);
  expect(parseFloat(getAvgByName('Estação Norte - Velocidade do Vento')!.value)).toBeCloseTo(10.08);

  // Estação Centro
  expect(parseFloat(getAvgByName('Estação Centro - Temperatura')!.value)).toBeCloseTo(25.18);
  expect(parseFloat(getAvgByName('Estação Centro - Umidade')!.value)).toBeCloseTo(65.24);
  expect(parseFloat(getAvgByName('Estação Centro - Pressão')!.value)).toBeCloseTo(1012.98);
  expect(parseFloat(getAvgByName('Estação Centro - Velocidade do Vento')!.value)).toBeCloseTo(10.08);

  // Estação Sul
  expect(parseFloat(getAvgByName('Estação Sul - Temperatura')!.value)).toBeCloseTo(25.20);
  expect(parseFloat(getAvgByName('Estação Sul - Umidade')!.value)).toBeCloseTo(65.14);
  expect(parseFloat(getAvgByName('Estação Sul - Pressão')!.value)).toBeCloseTo(1013.30);
  expect(parseFloat(getAvgByName('Estação Sul - Velocidade do Vento')!.value)).toBeCloseTo(10.04);
});
