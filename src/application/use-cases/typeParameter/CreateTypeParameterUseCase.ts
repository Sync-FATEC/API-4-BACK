import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { ITypeParameterRepository } from "../../../domain/models/entities/TypeParameter";
import CreateTypeParameterDTO from "../../../web/dtos/typeParameters/CreateTypeParameterDTO";

export class CreateTypeParameterUseCase {
    constructor(private typeParametersRepository: ITypeParameterRepository) {}

    async execute(typeParameterData: CreateTypeParameterDTO) {
        const typeParameter = await this.typeParametersRepository.findByName(typeParameterData.getName());
        if (typeParameter) {
            throw new SystemContextException("Nome de parâmetro de tipo já cadastrado");
        }

        return await this.typeParametersRepository.create({
            name: typeParameterData.getName(),
            unit: typeParameterData.getUnit(),
            numberOfDecimalsCases: typeParameterData.getNumberDecimalPlaces(),
            factor: typeParameterData.getfactor(),
            offset: typeParameterData.getOffset(),
            typeJson: typeParameterData.getTypeJson(),
        });
    }
}