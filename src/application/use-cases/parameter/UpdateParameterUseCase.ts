import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IParameterRepository } from "../../../domain/interfaces/repositories/IParameterRepository";
import UpdateParameterDTO from "../../../web/dtos/parameter/UpdateParameterDTO";

export default class UpdateParameterUseCase {
    constructor(private parameterRepository: IParameterRepository) {}

    async execute(parameterData: UpdateParameterDTO): Promise<any> {
        const parameter = await this.parameterRepository.findById(parameterData.getId());
        if (!parameter) {
            throw new SystemContextException('Parâmetro não encontrado');
        }

        return await this.parameterRepository.update(parameterData.getId(), {
            idTypeParameter: parameterData.getIdTypeParameter(),
            idStation: parameterData.getIdStation(),
        });
    }
}