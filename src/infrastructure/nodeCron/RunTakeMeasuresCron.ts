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

export class RunTakeMeasuresCron  {
    private uri = process.env.MONGO_URL || '';
    private client = new MongoClient(this.uri);

    private measureRepository = new MeasureRepository();
    private stationRepository = new StationRepository();
    private alertRepository = new AlertRepository();
    private typeAlertRepository = new TypeAlertRepository();
    private parameterRepository = new ParameterRepository();

    async execute() {
        try {
            await this.client.connect();
            const dbName = process.env.MONGO_DATABASE;
            const db = this.client.db(dbName);

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
            cron.schedule('*/10 * * * *', async () => {
                console.log('[CRON] Executando processamento de dados do MongoDB');
                await receiverMongoJsonUseCase.execute();
            });
        } catch (error) {
            console.error('Erro ao configurar cron job para MongoDB:', error);
        }
    }
}

const runner = new RunTakeMeasuresCron();
runner.execute();
