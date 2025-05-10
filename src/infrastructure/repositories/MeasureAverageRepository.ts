import { Between, MoreThan, Repository } from "typeorm";
import { MeasureAverage } from "../../domain/models/entities/MeasureAverage";
import { AppDataSource } from "../database/data-source";
import { IMeasureAverageRepository } from "../../domain/interfaces/repositories/IMeasureAverageRepository";

export class MeasureAverageRepository implements IMeasureAverageRepository {
    private measuresAverage: Repository<MeasureAverage> = AppDataSource.getRepository(MeasureAverage);

    async createMeasureAverage(measureAverage: Partial<MeasureAverage>): Promise<MeasureAverage> {
        const newMeasureAverage = this.measuresAverage.create(measureAverage);
        return await this.measuresAverage.save(newMeasureAverage);
    }

    async getById(id: string): Promise<MeasureAverage | null> {
        return await this.measuresAverage.findOne({
            where: { id }
        });
    }

    async listMeasuresAverages(stationId: string): Promise<MeasureAverage[]> {
        return await this.measuresAverage.find({
            where: { station: { id: stationId } }
        });
    }
    

    async listMeasuresAveragesWithStartAndEnd(stationId: string, start: Date, end: Date): Promise<MeasureAverage[]> {
        const startDate = new Date(start);
        startDate.setUTCHours(0, 0, 0, 0);
        
        const endDate = new Date(end);
        endDate.setUTCHours(23, 59, 59, 999);

        return await this.measuresAverage.find({
            where: {
                station: { id: stationId },
                createdAt: Between(startDate, endDate)
            }
        });
    }
    
    async listMeasuresAveragesLast7Days(stationId: string): Promise<MeasureAverage[]> {
        return await this.measuresAverage.find({
            where: { station: { id: stationId }, createdAt: MoreThan(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) }
        });
    }

    async listMeasuresAveragesWithDate(stationId: string, date: Date): Promise<MeasureAverage[]> {
        const start = new Date(date);
        start.setUTCHours(0, 0, 0, 0);
        
        const end = new Date(date);
        end.setUTCHours(23, 59, 59, 999);        
    
        return await this.measuresAverage.find({
            where: {
                station: { id: stationId },
                createdAt: Between(start, end)
            }
        });
    }
    
    async deleteMeasureAverage(id: string): Promise<boolean> {
        const result = await this.measuresAverage.delete(id);
        return result.affected ? result.affected > 0 : false;
    }

}