import { Between, Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { IMeasureRepository } from "../../../src/domain/interfaces/repositories/IMeasureRepository";
import { ListMeasureResponseDTO } from "../../web/dtos/measure/ListMeasureDTO";
import { Measure } from "../../domain/models/entities/Measure";
import Parameter from "../../domain/models/agregates/Parameter/Parameter";
import { Station } from "../../domain/models/entities/Station";
import { TypeParameter } from "../../domain/models/entities/TypeParameter";

export class MeasureRepository implements IMeasureRepository {
  private measures: Repository<Measure> = AppDataSource.getRepository(Measure);

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

  async listMeasuresLastHour(): Promise<Measure[]> {
    const now = Math.floor(Date.now() / 1000);
    const oneHourAgo = now - 3600;
  
    const measures = await this.measures.find({
      where: {
        unixTime: Between(oneHourAgo, now),
      },
      order: {
        unixTime: 'DESC',
      },
      relations: [
        "parameter",
        "parameter.idStation",
        "parameter.idTypeParameter",
      ],
    });
  
    return measures as MeasureWithRelations[];
  }
  
  async listMeasuresLastDay(): Promise<Measure[]> {
    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - 86400;
  
    const measures = await this.measures.find({
      where: {
        unixTime: Between(oneDayAgo, now),
      },
      order: {
        unixTime: 'DESC',
      },
      relations: [
        "parameter",
        "parameter.idStation",
        "parameter.idTypeParameter",
      ],
    });
  
    return measures as MeasureWithRelations[];
  }

}

type MeasureWithRelations = Measure & {
  parameter: Parameter & {
    idStation: Station;
    idTypeParameter: TypeParameter;
  };
};
