import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { IParameterRepository } from "src/domain/interfaces/repositories/IParameterRepository";
import Parameter from "src/domain/models/agregates/Parameter/Parameter";

export class ParameterRepository implements IParameterRepository {
    private parameters: Repository<Parameter> = AppDataSource.getRepository(Parameter);


    async getParameterById(id: string): Promise<Parameter | null> {
        const parameter = await this.parameters.findOne({ where: { id } });
        return parameter || null;
    }

    async getAllParameters(): Promise<Parameter[]> {
        return await this.parameters.find();
    }

    async createParameter(parameter: Parameter): Promise<Parameter> {
        return await this.parameters.save(parameter);
    }

    async updateParameter(id: string, parameter: Partial<Parameter>): Promise<Parameter | null> {
        await this.parameters.update(id, parameter);
        const updatedParameter = await this.parameters.findOne({ where: { id } });
        return updatedParameter || null;
    }

    async deleteParameter(id: string): Promise<boolean> {
        const result = await this.parameters.delete(id);
        return result.affected !== 0;
    }
}