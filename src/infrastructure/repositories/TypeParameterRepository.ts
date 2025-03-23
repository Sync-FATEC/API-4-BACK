import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { TypeParameter } from "../../domain/models/entities/TypeParameter";
import { ITypeParameterRepository } from "../../domain/interfaces/repositories/ITypeParameterRepository";

export default class TypeParemeterRepository implements ITypeParameterRepository {
    private repository: Repository<TypeParameter>;

    constructor() {
        this.repository = AppDataSource.getRepository(TypeParameter);
    }

    async create(typeParameterData: Partial<TypeParameter>): Promise<TypeParameter> {
        const typeParameter = this.repository.create(typeParameterData);
        return await this.repository.save(typeParameter);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected === 1;
    }

    async update(id: string, typeParameterData: Partial<TypeParameter>): Promise<TypeParameter | null> {
        const typeParameter = await this.repository.findOne({ where: { id } });
        if (!typeParameter) return null;

        await this.repository.update(id, typeParameterData);
        return await this.repository.findOne({ where: { id } });
    }

    async list(): Promise<TypeParameter[]> {
        return await this.repository.find();
    }

    async findById(id: string): Promise<TypeParameter | null> {
        return await this.repository.findOne({ where: { id } });
    }

    async findByName(name: string): Promise<TypeParameter | null> {
        return await this.repository.findOne({ where: { name } });
    }
}