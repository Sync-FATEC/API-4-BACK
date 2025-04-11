import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { IMeasureRepository } from "../../../src/domain/interfaces/repositories/IMeasureRepository";

import { ListMeasureResponseDTO } from "../../web/dtos/measure/ListMeasureDTO";
import { Measure } from "../../domain/models/entities/Measure";
import { param } from "express-validator";

export class MeasureRepository implements IMeasureRepository {
  private measures: Repository<Measure> = AppDataSource.getRepository(Measure);

  async listWithFilters(filters: { startDate?: Date; endDate?: Date; stationId?: string; parameterId?: string; }): Promise<Measure[]> {
    const queryBuilder = this.measures.createQueryBuilder('measure')
      .leftJoinAndSelect('measure.parameter', 'parameter'); // Important: Load the parameter relationship
    
    if (filters.startDate) {
      const startUnixTime = Math.floor(filters.startDate.getTime() / 1000);
      queryBuilder.andWhere('measure.unixTime >= :startUnixTime', { startUnixTime });
    }
    
    if (filters.endDate) {
      const endUnixTime = Math.floor(filters.endDate.getTime() / 1000);
      queryBuilder.andWhere('measure.unixTime <= :endUnixTime', { endUnixTime });
    }
    
    if (filters.parameterId) {
      queryBuilder.andWhere('parameter.id = :parameterId', { parameterId: filters.parameterId });
    }
    
    if (filters.stationId) {
      queryBuilder.leftJoin('parameter.idStation', 'station')
        .andWhere('station.id = :stationId', { stationId: filters.stationId });
    }
    
    return await queryBuilder.getMany();
  }

  // Método para criar um Measure
  async createMeasure(measure: Partial<Measure>): Promise<Measure> {
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
