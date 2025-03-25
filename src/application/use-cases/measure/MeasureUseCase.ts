import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";

export class MeasureUseCase {
  protected measureRepository: IMeasureRepository; // Declare a propriedade corretamente

  constructor(measureRepository: IMeasureRepository) {
    this.measureRepository = measureRepository;
  }
}
