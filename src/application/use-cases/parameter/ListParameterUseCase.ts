import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IParameterRepository } from "../../../domain/interfaces/repositories/IParameterRepository";

export class ListParameterUseCase {
    constructor(private parameterRepository: IParameterRepository) {}

    async execute(): Promise<any> {
        const parameters = await this.parameterRepository.listDTO();
        if (parameters.length === 0) {
            throw new SystemContextException('Nenhum parâmetro para listar');
        }

        return parameters;
    }
}