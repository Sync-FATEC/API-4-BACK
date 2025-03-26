import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";

export class MeasureUseCase {
  protected measureRepository: IMeasureRepository;

  constructor(measureRepository: IMeasureRepository) {
    this.measureRepository = measureRepository;
  }
}
