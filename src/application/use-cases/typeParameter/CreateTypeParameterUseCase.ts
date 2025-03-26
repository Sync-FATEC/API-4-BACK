import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { ITypeParameterRepository } from "../../../domain/interfaces/repositories/ITypeParameterRepository";
import CreateTypeParameterDTO from "../../../web/dtos/typeParameter/CreateTypeParameterDTO";

export class CreateTypeParameterUseCase {
    constructor(private typeParametersRepository: ITypeParameterRepository) {}

    async execute(typeParameterData: CreateTypeParameterDTO) {
        const name = await this.typeParametersRepository.findByName(typeParameterData.getName());
        if (name) {
            throw new SystemContextException("Nome do parâmetro de tipo já cadastrado");
        }

        const jsonType = await this.typeParametersRepository.findByTypeJson(typeParameterData.getTypeJson());
        if (jsonType) {
            throw new SystemContextException("Tipo do Json já cadastrado");
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