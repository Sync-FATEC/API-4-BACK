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

test('✅ Deve calcular e salvar médias por hora com banco real', async () => {
  const stations = await runStationSeeds(dataSource);
  const typeParameters = await runTypeParameterSeeds(dataSource);
  const parameters = await runParameterSeeds(dataSource, stations, typeParameters);
  await runMeasureSeeds(dataSource, parameters);

  const result = await useCase.executeLastHour();

  expect(result.length).toBe(15);

  // Agrupar os resultados por nome do parâmetro para testar os valores
  const temperatureResults = result.filter(avg => avg.name === 'Temperatura').map(r => parseFloat(r.value));
  const umidadeResults = result.filter(avg => avg.name === 'Umidade').map(r => parseFloat(r.value));
  const pressaoResults = result.filter(avg => avg.name === 'Pressão').map(r => parseFloat(r.value));
  const ventoResults = result.filter(avg => avg.name === 'Velocidade do Vento').map(r => parseFloat(r.value));

  // Verificar se os valores esperados estão presentes nos resultados
  expect(temperatureResults).toContain(25.20);
  expect(temperatureResults).toContain(25.18);

  expect(umidadeResults).toContain(65.04);
  expect(umidadeResults).toContain(65.24);
  expect(umidadeResults).toContain(65.14);

  expect(pressaoResults).toContain(1012.96);
  expect(pressaoResults).toContain(1012.98);
  expect(pressaoResults).toContain(1013.30);

  expect(ventoResults).toContain(10.08);
  expect(ventoResults).toContain(10.04);
});
