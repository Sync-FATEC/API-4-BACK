import { CreateParameterUseCase } from "../../../../src/application/use-cases/parameter/CreateParameterUseCase";
import { ParameterRepository } from "../../../../src/infrastructure/repositories/ParameterRepository";
import CreateParameterDTO from "../../../../src/web/dtos/parameter/CreateParameterDTO";
import { TypeParameter } from "../../../../src/domain/models/entities/TypeParameter";
import { Station } from "../../../../src/domain/models/entities/Station";

export async function createParameterSeed(idTypeParameter: TypeParameter, idStation: Station) {
    const parameterRepository = new ParameterRepository();
    const createParameterUseCase = new CreateParameterUseCase(parameterRepository);

    const parameterDTO = new CreateParameterDTO(
        idTypeParameter,
        idStation
    );

    const parameter = await createParameterUseCase.execute(parameterDTO);

    return parameter;
}
