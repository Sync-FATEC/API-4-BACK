import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { Measure } from "../../../domain/models/entities/Measure";
import { UpdateMeasureDTO } from "../../../web/dtos/measure/UpdateMeasureDTO";
import { MeasureUseCase } from "./MeasureUseCase";

export class UpdateMeasureUseCase extends MeasureUseCase {
  
  constructor(measureRepository: IMeasureRepository) {
    super(measureRepository);
  }

  public async execute(data: UpdateMeasureDTO): Promise<Measure | null> {

    let measure = await this.measureRepository.getById(data.id);


    if (!measure) {
      throw new SystemContextException("Medida não encontrada");
    }

    measure.unixTime = data.unixTime;
    measure.value = data.value;

    const updatedMeasure = await this.measureRepository.updateMeasure(measure);

    return updatedMeasure;
  }
}
