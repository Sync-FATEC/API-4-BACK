import { IParameterRepository } from "../../../domain/interfaces/repositories/IParameterRepository";

export default class DeleteParameterUseCase {
    constructor(private parameterRepository: IParameterRepository) {}

    async execute(id: string) {
        const parameter = await this.parameterRepository.findById(id);
        if (!parameter) {
            throw new Error('Parâmetro não encontrado');
        }

        return await this.parameterRepository.delete(id);
    }
}