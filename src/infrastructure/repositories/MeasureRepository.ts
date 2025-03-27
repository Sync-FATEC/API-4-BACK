import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { IMeasureRepository } from "../../../src/domain/interfaces/repositories/IMeasureRepository";

import { ListMeasureResponseDTO } from "../../web/dtos/measure/ListMeasureDTO";
import { Measure } from "../../domain/models/entities/Measure";
import { param } from "express-validator";

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
  async listMeasures(
    stationId: string | null
  ): Promise<ListMeasureResponseDTO[]> {
    let measures : Measure[];
    if (stationId) {
      measures = await this.measures.find({
        where: { parameter: { idStation: { id: stationId } } },
        relations: [
          "parameter",
          "parameter.idStation",
          "parameter.idTypeParameter",
        ],
      });
    } else {
      measures = await this.measures.find({
        relations: [
          "parameter",
          "parameter.idStation",
          "parameter.idTypeParameter",
        ],
      });
    }
    return measures.map(
      (measure) =>
        ({
          id: measure.id,
          unixTime: measure.unixTime,
          value: measure.value,
          parameterText: measure.parameter.getParameterName(),
        } as ListMeasureResponseDTO)
    );
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
