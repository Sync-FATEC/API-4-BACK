import cron from 'node-cron';
import { CreateMeasureAverageUseCase } from '../../application/use-cases/measureAverage/CreateMeasureAverageUseCase';
import { MeasureAverageRepository } from '../repositories/MeasureAverageRepository';
import { MeasureRepository } from '../repositories/MeasureRepository';

export class RunMeasureAverageCron {
  private measureRepository = new MeasureRepository();
  private measureAverageRepository = new MeasureAverageRepository();
  private useCase!: CreateMeasureAverageUseCase;

  private hourlyTask: cron.ScheduledTask | null = null;
  private dailyTask: cron.ScheduledTask | null = null;

  async execute() {
    try {
      if (process.env.SETUP_RUN === 'test') return;
      this.useCase = new CreateMeasureAverageUseCase(
        this.measureAverageRepository,
        this.measureRepository
      );

      // Executa a cada hora
      this.hourlyTask = cron.schedule('0 * * * *', async () => {
        console.log('[CRON] Executando cálculo de médias da última hora');
        await this.useCase.executeLastHour();
      });

      // Executa todo dia à meia-noite
      this.dailyTask = cron.schedule('0 0 * * *', async () => {
        console.log('[CRON] Executando cálculo de médias do último dia');
        await this.useCase.executeLastDay();
      });

    } catch (error) {
      console.error('Erro ao configurar cron jobs para médias:', error);
    }
  }

  async stop() {
    if (this.hourlyTask) {
      this.hourlyTask.stop();
    }
    if (this.dailyTask) {
      this.dailyTask.stop();
    }
  }
}
