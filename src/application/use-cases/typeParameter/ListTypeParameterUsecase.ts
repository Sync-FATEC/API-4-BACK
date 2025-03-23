import { ITypeParameterRepository } from "../../../domain/models/entities/TypeParameter";

export class ListTypeParameterUseCase {
    constructor(private typeParameterRepository: ITypeParameterRepository) {}

    async execute() {
        const typeParameters = await this.typeParameterRepository.list();
        if (typeParameters.length === 0) {
            throw new Error('Nenhum tipo de parâmetro para listar');
        }

        return typeParameters;
    }
}