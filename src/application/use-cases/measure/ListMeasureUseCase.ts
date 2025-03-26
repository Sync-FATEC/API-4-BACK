import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { Measure } from "../../../domain/models/agregates/Measure/Measure";
import { MeasureUseCase } from "./MeasureUseCase";
import { ListMeasureResponseDTO } from "../../../web/dtos/measure/ListMeasureDTO";

export class ListMeasureUseCase extends MeasureUseCase {
  
  constructor(measureRepository: IMeasureRepository) {
    super(measureRepository);
  }

  public async execute(): Promise<ListMeasureResponseDTO[]> {
    const measures = await this.measureRepository.listMeasures();
    return measures.map(measure => ({
      id: measure.id,
      unixTime: measure.unixTime,
      value: measure.value,
    }));
  }
}
