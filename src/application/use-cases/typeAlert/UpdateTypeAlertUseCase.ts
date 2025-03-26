import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IParameterRepository } from "../../../domain/interfaces/repositories/IParameterRepository";
import { ITypeAlertRepository } from "../../../domain/interfaces/repositories/ITypeAlertRepository";
import { TypeAlert } from "../../../domain/models/agregates/Alert/TypeAlert";
import { UpdateTypeAlertDTO } from "../../../web/dtos/alert/typeAlert/UpdateTypeAlertDTO";
import { TypeAlertUseCase } from "./TypeAlertUseCase";

export class UpdateTypeAlertUseCase extends TypeAlertUseCase {
  constructor(
    parameterRepository: IParameterRepository,
    typeAlertRepository: ITypeAlertRepository
  ) {
    super(parameterRepository, typeAlertRepository);
  }

  public async execute(data: UpdateTypeAlertDTO): Promise<void> {
    let parameter = await this.parameterRepository.findById(data.parameterId);

    if (parameter === null) {
      throw new SystemContextException("Parametro não encontrado");
    }

    let typeAlert = TypeAlert.create(
      data.name,
      data.comparisonOperator,
      data.value,
      parameter
    );

    this.typeAlertRepository.update(data.id,    typeAlert);
  }
}
