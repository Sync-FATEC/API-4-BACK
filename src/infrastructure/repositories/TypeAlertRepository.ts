import { ITypeAlertRepository } from "src/domain/interfaces/repositories/ITypeAlertRepository";
import { TypeAlert } from "src/domain/models/agregates/Alert/TypeAlert";
import { Repository } from "typeorm";

export class TypeAlertRepository implements ITypeAlertRepository {
    private typeAlerts: Repository<TypeAlert>;

    async findById(id: string): Promise<TypeAlert | null> {
        const typeAlert = await this.typeAlerts.findOne({ where: { id } });
        return typeAlert || null;
    }

    async findAll(): Promise<TypeAlert[]> {
        return await this.typeAlerts.find();
    }

    async create(typeAlert: TypeAlert): Promise<TypeAlert> {
        return await this.typeAlerts.save(typeAlert);
    }

    async update(id: string, typeAlert: Partial<TypeAlert>): Promise<TypeAlert | null> {
        await this.typeAlerts.update(id, typeAlert);
        const updatedTypeAlert = await this.typeAlerts.findOne({ where: { id } });
        return updatedTypeAlert || null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.typeAlerts.delete(id);
        return result.affected !== 0;
    }
}