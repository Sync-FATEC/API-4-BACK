import dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import { MongoClient } from 'mongodb';
import { AlertRepository } from '../repositories/AlertRepository';
import { MeasureRepository } from '../repositories/MeasureRepository';
import { MongoDbRepository } from '../repositories/MongoDbRepository';
import { ParameterRepository } from '../repositories/ParameterRepository';
import StationRepository from '../repositories/StationRepository';
import TypeAlertRepository from '../repositories/TypeAlertRepository';
import { ReceiverMongoJsonUseCase } from '../../application/use-cases/receiverJson/receiverMongoUseCase';

export class RunTakeMeasuresCron {
  private measureRepository = new MeasureRepository();
  private stationRepository = new StationRepository();
  private alertRepository = new AlertRepository();
  private typeAlertRepository = new TypeAlertRepository();
  private parameterRepository = new ParameterRepository();

  private task: cron.ScheduledTask | null = null;

  async execute() {
    try {
      if (process.env.SETUP_RUN=== 'test') return;
      const uri = process.env.MONGO_URL || '';
      const client = new MongoClient(uri);
      await client.connect();
      const dbName = process.env.MONGO_DATABASE;
      const db = client.db(dbName);

      const mongoDbRepository = new MongoDbRepository(db, 'measures');

      const receiverMongoJsonUseCase = new ReceiverMongoJsonUseCase(
        mongoDbRepository,
        this.stationRepository,
        this.alertRepository,
        this.typeAlertRepository,
        this.measureRepository,
        this.parameterRepository
      );

      // Cron job para executar a cada 10 minutos
      this.task = cron.schedule('*/10 * * * *', async () => {
        console.log('[CRON] Executando processamento de dados do MongoDB');
        await receiverMongoJsonUseCase.execute();
      });

    } catch (error) {
      console.error('Erro ao configurar cron job para MongoDB:', error);
    }
  }
}
