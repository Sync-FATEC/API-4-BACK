import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { Measure } from "../../../domain/models/agregates/Measure/Measure";
import { RegisterMeasureDTO } from "../../../web/dtos/measure/RegisterMesureDTO";
import { MeasureUseCase } from "./MeasureUseCase";

export class RegisterMeasureUseCase extends MeasureUseCase {
  
  constructor(measureRepository: IMeasureRepository) {
    super(measureRepository);
  }

  public async execute(data: RegisterMeasureDTO): Promise<Measure> {
    const measure = Measure.create(data.unixTime, data.value);
    await this.measureRepository.createMeasure(measure);
    return measure;
  }
}
