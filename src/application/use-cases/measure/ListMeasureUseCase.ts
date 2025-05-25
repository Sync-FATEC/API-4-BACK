import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { MeasureUseCase } from "./MeasureUseCase";
import { ListMeasureResponseDTO } from "../../../web/dtos/measure/ListMeasureDTO";

export class ListMeasureUseCase extends MeasureUseCase {
  constructor(measureRepository: IMeasureRepository) {
    super(measureRepository);
  }

  public async execute(
    stationId: string | null
  ): Promise<ListMeasureResponseDTO[]> {
    return await this.measureRepository.listMeasures(stationId);
  }

  public async executePublic(
    stationId: string | null
  ): Promise<ListMeasureResponseDTO[]> {
    return await this.measureRepository.listWithFilters(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date(), stationId);
  }
}
