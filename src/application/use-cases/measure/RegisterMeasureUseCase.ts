import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { IParameterRepository } from "../../../domain/interfaces/repositories/IParameterRepository";
import { Measure } from "../../../domain/models/entities/Measure";

import { RegisterMeasureDTO } from "../../../web/dtos/measure/RegisterMesureDTO";
import { MeasureUseCase } from "./MeasureUseCase";

export class RegisterMeasureUseCase extends MeasureUseCase {
  
  private parameterRepository: IParameterRepository;

  constructor(measureRepository: IMeasureRepository, parameterRepository: IParameterRepository) {
    super(measureRepository);
  }

  public async execute(data: RegisterMeasureDTO): Promise<Measure> {
    const parameter = await this.parameterRepository.getWithParameterThenInclude(data.parameterId);

    if (!parameter) {
      throw new SystemContextException("Paramemetro não encontrado");
    }

    let typeParameter = parameter.idTypeParameter;

    let value = data.value * typeParameter.factor + typeParameter.offset;

    const measure = Measure.create(data.unixTime, value);

    await this.measureRepository.createMeasure(measure);
    return measure;
  }
}
