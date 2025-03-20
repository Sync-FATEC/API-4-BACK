import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { IStationRepository, Station } from "../../domain/models/entities/Station";

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

    async findById(id: string): Promise<Station | null> {
        return await this.repository.findOne({ where: { id } });
    }

    async findByUuid(uuid: string): Promise<Station | null> {
        return await this.repository.findOne({ where: { uuid } });
    }
}