import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import Parameter from "../../domain/models/agregates/Parameter/Parameter";
import { IParameterRepository } from "../../domain/interfaces/repositories/IParameterRepository";

export class ParameterRepository implements IParameterRepository {
    private repository: Repository<Parameter>;

    constructor() {
        this.repository = AppDataSource.getRepository(Parameter);
    }

    async create(parameter: Partial<Parameter>): Promise<Parameter> {
        const newParameter = this.repository.create(parameter);
        return await this.repository.save(newParameter);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected === 1;
    }

    async update(id: string, parameter: Partial<Parameter>): Promise<Parameter> {
        await this.repository.update(id, parameter);
        return await this.repository.findOneByOrFail({ id });
    }

    async list(): Promise<Parameter[]> {
        return await this.repository.find();
    }

    async findById(id: string): Promise<Parameter | null> {
        return await this.repository.findOneBy({ id });
    }
}