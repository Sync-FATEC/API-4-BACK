import { DataSource } from 'typeorm';
import Parameter from '../../../src/domain/models/agregates/Parameter/Parameter';
import { Station } from '../../../src/domain/models/entities/Station';
import { TypeParameter } from '../../../src/domain/models/entities/TypeParameter';

/**
 * Insere parâmetros de teste no banco de dados, relacionando estações com tipos de parâmetros
 * @param dataSource Conexão com o banco de dados
 * @param stations Estações já criadas no banco
 * @param typeParameters Tipos de parâmetros já criados no banco
 * @returns Array com os parâmetros criados
 */
export async function runParameterSeeds(
  dataSource: DataSource,
  stations: Station[],
  typeParameters: TypeParameter[]
): Promise<Parameter[]> {
  const parameterRepo = dataSource.getRepository(Parameter);
  const parameters: Parameter[] = [];

  // Para cada estação, criar parâmetros para cada tipo de parâmetro
  for (const station of stations) {
    for (const typeParam of typeParameters) {
      const parameter = parameterRepo.create({
        idStation: station,
        idTypeParameter: typeParam,
      });
      parameters.push(parameter);
    }
  }

  // Salvar parâmetros no banco
  return await parameterRepo.save(parameters);
}

/**
 * Remove todos os parâmetros do banco de dados
 * @param dataSource Conexão com o banco de dados
 */
export async function clearParameterSeeds(dataSource: DataSource): Promise<void> {
  const parameterRepo = dataSource.getRepository(Parameter);
  await parameterRepo.clear();
}