import { Between, Repository } from "typeorm";
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
            where: { stationId: { id: stationId } }
        });
    }

    async deleteMeasureAverage(id: string): Promise<boolean> {
        const result = await this.measuresAverage.delete(id);
        return result.affected ? result.affected > 0 : false;
    }

}