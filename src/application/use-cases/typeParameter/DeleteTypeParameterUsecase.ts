import { ITypeParameterRepository } from "../../../domain/interfaces/repositories/ITypeParameterRepository";

export default class DeleteTypeParameterUseCase {
    constructor(private typeParameterRepository: ITypeParameterRepository) {}

    async execute(id: string) {
        const typeParameter = await this.typeParameterRepository.findById(id);
        if (!typeParameter) {
            throw new Error('Tipo de parâmetro não encontrado');
        }

        return await this.typeParameterRepository.delete(id);
    }
}