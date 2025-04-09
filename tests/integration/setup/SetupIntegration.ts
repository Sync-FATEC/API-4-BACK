import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../../src/infrastructure/database/data-source';
import { Station } from '../../../src/domain/models/entities/Station';
import { TypeParameter } from '../../../src/domain/models/entities/TypeParameter';
import Parameter from '../../../src/domain/models/agregates/Parameter/Parameter';
import { MeasureAverage } from '../../../src/domain/models/entities/MeasureAverage';
import { Measure } from '../../../src/domain/models/entities/Measure';
import { Alert } from '../../../src/domain/models/agregates/Alert/Alert';
import { TypeAlert } from '../../../src/domain/models/agregates/Alert/TypeAlert';

let container: StartedTestContainer;
let dataSource: DataSource;

// Exportando o container e datasource para serem usados nos testes se necessário
export const getContainer = () => container;
export const getDataSource = () => dataSource;

export default async () => {
  // Cria um container PostgreSQL
  container = await new GenericContainer('postgres')
    .withExposedPorts(5432)
    .withEnvironment({ POSTGRES_DB: 'test' })
    .withEnvironment({ POSTGRES_USER: 'test' })
    .withEnvironment({ POSTGRES_PASSWORD: 'test' })
    .start();

  const port = container.getMappedPort(5432);
  const host = container.getHost();

  AppDataSource.setOptions({
    type: 'postgres',
    host,
    port,
    username: 'test',
    password: 'test',
    database: 'test',
    synchronize: true,
    entities: [
      Station,
      TypeParameter,
      Parameter,
      MeasureAverage,
      Measure,
      Alert,
      TypeAlert
    ],
  });

  dataSource = await AppDataSource.initialize();
};
