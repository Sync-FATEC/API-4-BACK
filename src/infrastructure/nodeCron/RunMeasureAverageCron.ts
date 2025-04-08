import cron from 'node-cron';
import { CreateMeasureAverageUseCase } from '../../application/use-cases/measureAverage/CreateMeasureAverageUseCase';
import { MeasureAverageRepository } from '../repositories/MeasureAverageRepository';
import { MeasureRepository } from '../repositories/MeasureRepository';

export class RunMeasureAverageCron {
    private measureRepository = new MeasureRepository();
    private measureAverageRepository = new MeasureAverageRepository();
    private useCase: CreateMeasureAverageUseCase;

    async execute() {
        try {
            this.useCase = new CreateMeasureAverageUseCase(
                this.measureAverageRepository,
                this.measureRepository
            );

            // Cron job para executar a cada hora
            cron.schedule('0 * * * *', async () => {
                console.log('[CRON] Executando cálculo de médias da última hora');
                await this.useCase.executeLastHour();
            });

            // Cron job para executar todo dia à meia-noite
            cron.schedule('0 0 * * *', async () => {
                console.log('[CRON] Executando cálculo de médias do último dia');
                await this.useCase.executeLastDay();
            });
        } catch (error) {
            console.error('Erro ao configurar cron jobs para médias:', error);
        }
    }
}

const runner = new RunMeasureAverageCron();
runner.execute();