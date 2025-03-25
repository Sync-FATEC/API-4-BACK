import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { MeasureUseCase } from "./MeasureUseCase";
import { DeleteMeasureResponseDTO } from "../../../web/dtos/measure/DeleteMeasureDTO";
import { SystemContextException } from "../../../domain/exceptions/SystemContextException";

export class DeleteMeasureUseCase extends MeasureUseCase {
  
  constructor(measureRepository: IMeasureRepository) {
    super(measureRepository);
  }

  public async execute(id: string): Promise<DeleteMeasureResponseDTO> {
    const measure = await this.measureRepository.getById(id);

    if (!measure) {
      throw new Error("Measure not found");
    }

    await this.measureRepository.deleteMeasure(id);

    return {
      success: true,
      message: "Measure deleted successfully",
    };
  }
}
