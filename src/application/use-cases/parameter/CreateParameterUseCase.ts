import { IParameterRepository } from "../../../domain/interfaces/repositories/IParameterRepository";
import CreateParameterDTO from "../../../web/dtos/parameter/CreateParameterDTO";

export class CreateParameterUseCase {
    constructor(private parametersRepository: IParameterRepository) {}

    async execute(parameterData: CreateParameterDTO) {
        return await this.parametersRepository.create({
            idTypeParameter: parameterData.getIdTypeParameter(),
            idStation: parameterData.getIdStation(),
        });
    }
}