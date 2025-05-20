import { CreateTypeParameterUseCase } from "../../../../src/application/use-cases/typeParameter/CreateTypeParameterUseCase";

import CreateTypeParameterDTO from "../../../../src/web/dtos/typeParameter/CreateTypeParameterDTO";

import TypeParameterRepository from "../../../../src/infrastructure/repositories/TypeParameterRepository";

export async function createTypeParameterSeed(name: string, unit: string, numberOfDecimals: number, factor: number, offset: number, typeJson: string) {
    const typeParameterRepository = new TypeParameterRepository();
    const createTypeParameterUseCase = new CreateTypeParameterUseCase(typeParameterRepository);

    const typeParameterDTO = new CreateTypeParameterDTO(
        name,
        unit,
        numberOfDecimals,
        factor,
        offset,
        typeJson,
    );  

    const typeParameter = await createTypeParameterUseCase.execute(typeParameterDTO);

    return typeParameter;
}

