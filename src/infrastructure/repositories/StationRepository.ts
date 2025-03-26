import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Station } from "../../domain/models/entities/Station";
import { IStationRepository } from "../../domain/interfaces/repositories/IStationRepository";

export default class StationRepository implements IStationRepository {
    private repository: Repository<Station>;

    constructor() {
        this.repository = AppDataSource.getRepository(Station);
    }

    async create(stationData: Partial<Station>): Promise<Station> {
       const station = this.repository.create(stationData);
       return await this.repository.save(station); 
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected === 1;
    }

    async update(id: string, stationData: Partial<Station>): Promise<Station | null> {
        const user = await this.repository.findOne({ where: { id } });
        if (!user) return null;

        await this.repository.update(id, stationData);
        return await this.repository.findOne({ where: { id } });
    }

    async list(): Promise<Station[]> {
        return await this.repository.find();
    }

    async listWithParameters(): Promise<Station[]> {
        return await this.repository.find({
            relations: ['parameters.idTypeParameter', 'parameters.typeAlerts']
        });
    }

    async findById(id: string): Promise<Station | null> {
        return await this.repository.findOne({ 
            where: { id },
            relations: ['parameters.idTypeParameter', 'parameters.typeAlerts']
        });
    }

    async findByUuid(uuid: string): Promise<Station | null> {
        return await this.repository.findOne({ 
            where: { uuid },
            relations: ['parameters.idTypeParameter', 'parameters.typeAlerts']
        });
    }
}