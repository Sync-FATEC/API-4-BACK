import { IParameterRepository } from "../../../domain/interfaces/repositories/IParameterRepository";
import { ITypeAlertRepository } from "../../../domain/interfaces/repositories/ITypeAlertRepository";

export abstract class TypeAlertUseCase {
    protected parameterRepository: IParameterRepository | null;
    protected typeAlertRepository: ITypeAlertRepository | null;

    constructor(
        parameterRepository: IParameterRepository | null,
        typeAlertRepository: ITypeAlertRepository | null
    ) {
        this.parameterRepository = parameterRepository;
        this.typeAlertRepository = typeAlertRepository;
    }
}

