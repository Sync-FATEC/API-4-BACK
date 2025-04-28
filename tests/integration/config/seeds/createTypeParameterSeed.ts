import { CreateTypeParameterUseCase } from "../../../../src/application/use-cases/typeParameter/CreateTypeParameterUseCase";

import CreateTypeParameterDTO from "../../../../src/web/dtos/typeParameter/CreateTypeParameterDTO";

import TypeParameterRepository from "../../../../src/infrastructure/repositories/TypeParameterRepository";

export async function createTypeParameterSeed() {
    const typeParameterRepository = new TypeParameterRepository();
    const createTypeParameterUseCase = new CreateTypeParameterUseCase(typeParameterRepository);

    const typeParameterDTO = new CreateTypeParameterDTO(
        'Temperatura',
        '°C',
        1,
        1,
        0,
        'temp',
    );  

    const typeParameter = await createTypeParameterUseCase.execute(typeParameterDTO);

    return typeParameter;
}

