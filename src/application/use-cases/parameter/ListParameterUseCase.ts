import { IParameterRepository } from "../../../domain/interfaces/repositories/IParameterRepository";

export class ListParameterUseCase {
    constructor(private parameterRepository: IParameterRepository) {}

    async execute() {
        const parameters = await this.parameterRepository.listDTO();
        if (parameters.length === 0) {
            throw new Error('Nenhum parâmetro para listar');
        }

        return parameters;
    }
}