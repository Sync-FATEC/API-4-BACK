import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { IMeasureRepository } from "../../../src/domain/interfaces/repositories/IMeasureRepository";
import { Measure } from "../../../src/domain/models/agregates/Measure/Measure";

export class MeasureRepository implements IMeasureRepository {
  private measures: Repository<Measure> = AppDataSource.getRepository(Measure);

  // Método para criar um Measure
  async createMeasure(measure: Measure): Promise<Measure> {
    return await this.measures.save(measure);
  }

  // Método para buscar um Measure por ID
  async getById(id: string): Promise<Measure | null> {
    const measure = await this.measures.findOne({ where: { id } });
    return measure || null;
  }

  // Método para listar todos os Measures
  async listMeasures(): Promise<Measure[]> {
    return await this.measures.find();
  }

  // Método para excluir um Measure
  async deleteMeasure(id: string): Promise<boolean> {
    const result = await this.measures.delete(id);
    return result.affected !== 0;
  }

  // Método para atualizar um Measure
  async updateMeasure(measure: Measure): Promise<Measure> {
    return await this.measures.save(measure);
  }
}
