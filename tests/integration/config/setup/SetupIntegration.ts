import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../../../src/infrastructure/database/data-source';
import { Station } from '../../../../src/domain/models/entities/Station';
import { TypeParameter } from '../../../../src/domain/models/entities/TypeParameter';
import Parameter from '../../../../src/domain/models/agregates/Parameter/Parameter';
import { MeasureAverage } from '../../../../src/domain/models/entities/MeasureAverage';
import { Measure } from '../../../../src/domain/models/entities/Measure';
import { Alert } from '../../../../src/domain/models/agregates/Alert/Alert';
import { TypeAlert } from '../../../../src/domain/models/agregates/Alert/TypeAlert';
import { Client } from 'pg';
import { EmailStation } from '../../../../src/domain/models/entities/EmailsStation';
import { User } from '../../../../src/domain/models/entities/User';

let container: StartedTestContainer;
let dataSource: DataSource;

export const getContainer = () => container;
export const getDataSource = () => dataSource;

const waitForPostgres = async (host: string, port: number, retries = 10, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = new Client({
        host,
        port,
        user: 'test',
        password: 'test',
        database: 'test',
      });
      await client.connect();
      await client.end();
      return;
    } catch (err) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('PostgreSQL não ficou pronto a tempo.');
};

const SetupIntegration = async () => {
  container = await new GenericContainer('postgres')
    .withExposedPorts(5432)
    .withEnvironment({
      POSTGRES_DB: 'test',
      POSTGRES_USER: 'test',
      POSTGRES_PASSWORD: 'test',
    })
    .start();

  const port = container.getMappedPort(5432);
  const host = container.getHost();

  await waitForPostgres(host, port);

  AppDataSource.setOptions({
    type: 'postgres',
    host,
    port,
    username: 'test',
    password: 'test',
    database: 'test',
    synchronize: true,
    entities: [
      User,
      TypeAlert,
      Alert,
      Parameter,
      TypeParameter,
      Measure,
      Station,
      EmailStation,
      MeasureAverage
    ],
  });

  dataSource = await AppDataSource.initialize();
  await dataSource.synchronize(true);
};

export default SetupIntegration;
