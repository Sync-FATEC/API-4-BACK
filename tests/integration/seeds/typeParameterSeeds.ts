import { DataSource } from 'typeorm';
import { TypeParameter } from '../../../src/domain/models/entities/TypeParameter';

/**
 * Insere tipos de parâmetros de teste no banco de dados
 * @param dataSource Conexão com o banco de dados
 * @returns Array com os tipos de parâmetros criados
 */
export async function runTypeParameterSeeds(dataSource: DataSource): Promise<TypeParameter[]> {
  const typeParamRepo = dataSource.getRepository(TypeParameter);
  
  // Criar tipos de parâmetros de teste
  const typeParameters = [
    typeParamRepo.create({
      typeJson: "temp",
      name: 'Temperatura',
      unit: '°C',
      numberOfDecimalsCases: 1,
      factor: 1,
      offset: 0
    }),
    typeParamRepo.create({
      typeJson: "umit",
      name: 'Umidade',
      unit: '%',
      numberOfDecimalsCases: 0,
      factor: 1,
      offset: 0
    }),
    typeParamRepo.create({
      typeJson: "press",
      name: 'Pressão',
      unit: 'hPa',
      numberOfDecimalsCases: 0,
      factor: 1,
      offset: 0
    }),
    typeParamRepo.create({
      typeJson: "wind",
      name: 'Velocidade do Vento',
      unit: 'km/h',
      numberOfDecimalsCases: 1,
      factor: 1,
      offset: 0
    }),
    typeParamRepo.create({
      typeJson: "rain",
      name: 'Precipitação',
      unit: 'mm',
      numberOfDecimalsCases: 1,
      factor: 1,
      offset: 0
    }),
  ];

  // Salvar tipos de parâmetros no banco
  return await typeParamRepo.save(typeParameters);
}

/**
 * Remove todos os tipos de parâmetros do banco de dados
 * @param dataSource Conexão com o banco de dados
 */
export async function clearTypeParameterSeeds(dataSource: DataSource): Promise<void> {
  const typeParamRepo = dataSource.getRepository(TypeParameter);
  await typeParamRepo.clear();
}