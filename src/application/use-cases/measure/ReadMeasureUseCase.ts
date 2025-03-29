import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { MeasureUseCase } from "./MeasureUseCase";
import { ReadMeasureResponseDTO } from "../../../web/dtos/measure/ReadMeasureDTO";

export class ReadMeasureUseCase extends MeasureUseCase {
  
  constructor(measureRepository: IMeasureRepository) {
    super(measureRepository);
  }

  public async execute(id: string): Promise<ReadMeasureResponseDTO | null> {
    const measure = await this.measureRepository.getById(id);

    if (!measure) {
      return null;
    }

    return {
      id: measure.id,
      unixTime: measure.unixTime,
      value: measure.value,
    };
  }
}
