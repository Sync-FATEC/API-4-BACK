import { ITypeParameterRepository } from "../../../domain/models/entities/TypeParameter";
import { TypeParameter } from "../../../domain/models/entities/TypeParameter";
import UpdateTypeParameterDTO from "../../../web/dtos/typeParameters/UpdateTypeParameterDTO"; 

export default class UpdateTypeParameterUseCase {
    constructor(private typeParameterRepository: ITypeParameterRepository) {}

    async execute(typeParameterData: UpdateTypeParameterDTO) {
        const typeParameter = await this.typeParameterRepository.findById(typeParameterData.getId());
        if (!typeParameter) {
            throw new Error('Tipo de parâmetro não encontrado');
        }

        const updateData: Partial<TypeParameter> = {
            name: typeParameterData.getName(),
            unit: typeParameterData.getUnit(),
            numberOfDecimalsCases: typeParameterData.getNumberDecimalPlaces(),
            factor: typeParameterData.getfactor(),
            offset: typeParameterData.getOffset(),
            typeJson: typeParameterData.getTypeJson(),
        }
        if (typeParameterData.getId() != typeParameter.id) {
            updateData.id = typeParameterData.getId();
        }

        await this.typeParameterRepository.update(typeParameter.id, updateData);
    }
}