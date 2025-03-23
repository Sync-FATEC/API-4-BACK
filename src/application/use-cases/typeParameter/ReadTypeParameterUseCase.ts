import { ITypeParameterRepository } from "../../../domain/interfaces/repositories/ITypeParameterRepository";
import { TypeParameter } from "../../../domain/models/entities/TypeParameter";

export class ReadTypeParameterUseCase {
    constructor(private typeParameterRepository: ITypeParameterRepository) {}

    async execute(id: string): Promise<TypeParameter | null> {
        const typeParameter = await this.typeParameterRepository.findById(id);
        if (!typeParameter) {
            throw new Error('Tipo de parâmetro não encontrado');
        }

        return typeParameter;
    }
}