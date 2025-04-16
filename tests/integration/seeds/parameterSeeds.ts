import { DataSource } from 'typeorm';
import Parameter from '../../../src/domain/models/agregates/Parameter/Parameter';
import { Station } from '../../../src/domain/models/entities/Station';
import { TypeParameter } from '../../../src/domain/models/entities/TypeParameter';

export async function runParameterSeeds(
  dataSource: DataSource,
  stations: Station[],
  typeParameters: TypeParameter[]
): Promise<Parameter[]> {
  const parameterRepo = dataSource.getRepository(Parameter);
  const parameters: Parameter[] = [];

  for (const station of stations) {
    for (const typeParam of typeParameters) {
      const parameter = parameterRepo.create({
        idStation: station,
        idTypeParameter: typeParam,
      });
      parameters.push(parameter);
    }
  }

  return await parameterRepo.save(parameters);
}

export async function clearParameterSeeds(dataSource: DataSource): Promise<void> {
  const parameterRepository = dataSource.getRepository(Parameter);
  
  const parameters = await parameterRepository.find();
  
  if (parameters.length > 0) {
    await parameterRepository.remove(parameters);
  }
}