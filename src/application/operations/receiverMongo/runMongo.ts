import dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import { MongoClient } from 'mongodb';
import { AlertRepository } from '../../../infrastructure/repositories/AlertRepository';
import { MeasureRepository } from '../../../infrastructure/repositories/MeasureRepository';
import { MongoDbRepository } from '../../../infrastructure/repositories/MongoDbRepository';
import { ParameterRepository } from '../../../infrastructure/repositories/ParameterRepository';
import StationRepository from '../../../infrastructure/repositories/StationRepository';
import TypeAlertRepository from '../../../infrastructure/repositories/TypeAlertRepository';
import { ReceiverMongoJsonUseCase } from '../../use-cases/receiverJson/receiverMongoUseCase';

export class runReceiverMongo {
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

            cron.schedule('*/10 * * * *', () => {
                receiverMongoJsonUseCase.execute();
            });
        } catch (error) {
            console.error('Erro ao conectar ao MongoDB:', error);
        }
    }
}

const runner = new runReceiverMongo();
runner.execute();
