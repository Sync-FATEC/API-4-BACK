import { IParameterRepository } from "@/domain/interfaces/repositories/IParameterRepository";
import { ITypeAlertRepository } from "@/domain/interfaces/repositories/ITypeAlertRepository";
import { TypeAlertUseCase } from "./TypeAlertUseCase";
import { SystemContextException } from "@/domain/exceptions/SystemContextException";
import { UpdateTypeAlertDTO } from "@/web/dtos/alert/typeAlert/UpdateTypeAlertDTO";
import { TypeAlert } from "@/domain/models/agregates/Alert/TypeAlert";

export class UpdateTypeAlertUseCase extends TypeAlertUseCase {


    constructor(parameterRepository: IParameterRepository, typeAlertRepository: ITypeAlertRepository) {
        super(parameterRepository, typeAlertRepository);
    }

    
    public async execute(data: UpdateTypeAlertDTO): Promise<void> {


        let parameter = await this.parameterRepository.getParameterById(data.parameterId);

        if(parameter === null){
            throw new SystemContextException('Parameter not found');
        }
        
        let typeAlert = TypeAlert.create(data.name, data.comparisonOperator, parameter);

        this.typeAlertRepository.create(typeAlert);

    }
}

