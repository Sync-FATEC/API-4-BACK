import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { MeasureUseCase } from "./MeasureUseCase";
import { ListMeasureResponseDTO } from "../../../web/dtos/measure/ListMeasureDTO";

export class ListMeasureUseCase extends MeasureUseCase {
  
  constructor(measureRepository: IMeasureRepository) {
    super(measureRepository);
  }

  public async execute(): Promise<ListMeasureResponseDTO[]> {
    return await this.measureRepository.listMeasures();
  }
}
