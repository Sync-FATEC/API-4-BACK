import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { Measure } from "../../../domain/models/agregates/Measure/Measure";
import { UpdateMeasureDTO } from "../../../web/dtos/measure/UpdateMeasureDTO";
import { MeasureUseCase } from "./MeasureUseCase";

export class UpdateMeasureUseCase extends MeasureUseCase {
  
  constructor(measureRepository: IMeasureRepository) {
    super(measureRepository);
  }

  public async execute(data: UpdateMeasureDTO): Promise<Measure | null> {
    // Primeiro, tenta encontrar a medida pelo ID
    let measure = await this.measureRepository.getById(data.id);

    // Se a medida não for encontrada, lança um erro
    if (!measure) {
      throw new SystemContextException("Measure not found");
    }

    // Atualiza as propriedades da medida com os dados fornecidos
    measure.unixTime = data.unixTime;
    measure.value = data.value;

    // Chama o método de repositório para atualizar a medida no banco de dados
    const updatedMeasure = await this.measureRepository.updateMeasure(measure);

    // Retorna a medida atualizada
    return updatedMeasure;
  }
}
