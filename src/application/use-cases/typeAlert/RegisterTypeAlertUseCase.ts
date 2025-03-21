import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IParameterRepository } from "../../../domain/interfaces/repositories/IParameterRepository";
import { ITypeAlertRepository } from "../../../domain/interfaces/repositories/ITypeAlertRepository";
import { TypeAlert } from "../../../domain/models/agregates/Alert/TypeAlert";
import { RegisterTypeAlertDTO } from "../../../web/dtos/alert/typeAlert/RegisterTypeAlertDTO";
import { TypeAlertUseCase } from "./TypeAlertUseCase";


export class RegisterTypeAlertUseCase extends TypeAlertUseCase {

    constructor(parameterRepository: IParameterRepository, typeAlertRepository: ITypeAlertRepository) {
        super(parameterRepository, typeAlertRepository);
    }

    public async execute(data: RegisterTypeAlertDTO): Promise<TypeAlert> {
        
        let parameter = await this.parameterRepository.getParameterById(data.parameterId);

        if(parameter === null){
            throw new SystemContextException('Parametro não encontrado');
        }
        
        let typeAlert = TypeAlert.create(data.name, data.comparisonOperator, parameter);

        this.typeAlertRepository.create(typeAlert);

        return typeAlert
    }
}

