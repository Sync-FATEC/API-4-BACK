import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { IParameterRepository } from "../../../domain/interfaces/repositories/IParameterRepository";
import { IStationRepository } from "../../../domain/interfaces/repositories/IStationRepository";
import { Measure } from "../../../domain/models/entities/Measure";

import { RegisterMeasureDTO } from "../../../web/dtos/measure/RegisterMesureDTO";
import { MeasureUseCase } from "./MeasureUseCase";

export class RegisterMeasureUseCase extends MeasureUseCase {
  
  private parameterRepository: IParameterRepository;
  private stationRepository: IStationRepository;

  constructor(measureRepository: IMeasureRepository, parameterRepository: IParameterRepository, stationRepository: IStationRepository) {
    super(measureRepository);
    this.parameterRepository = parameterRepository;
    this.stationRepository = stationRepository; 
  }

  // Cria uma nova medição em um parâmetro(estação + tipo de parametro) específico.
  public async execute(data: RegisterMeasureDTO): Promise<Measure> {
    const parameter = await this.parameterRepository.getWithParameterThenInclude(data.parameterId);

    if (!parameter) {
      throw new SystemContextException("Paramemetro não encontrado");
    }

    const typeParameter = parameter.idTypeParameter;

    const value = data.value * typeParameter.factor + typeParameter.offset;

    const measure = Measure.create(data.unixTime, value);
    measure.parameter = parameter;
    const measureCreate = await this.measureRepository.createMeasure(measure);
    await this.stationRepository.update(parameter.idStation.id, { DateLastMeasure: measureCreate.unixTime})
    return measureCreate;
  }
}
