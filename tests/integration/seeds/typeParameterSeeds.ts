import { DataSource } from 'typeorm';
import { TypeParameter } from '../../../src/domain/models/entities/TypeParameter';

export async function runTypeParameterSeeds(dataSource: DataSource): Promise<TypeParameter[]> {
  const typeParamRepo = dataSource.getRepository(TypeParameter);
  
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

  return await typeParamRepo.save(typeParameters);
}

export async function clearTypeParameterSeeds(dataSource: DataSource): Promise<void> {
  const typeParameterRepository = dataSource.getRepository(TypeParameter);
  
  const typeParameters = await typeParameterRepository.find();
  
  if (typeParameters.length > 0) {
    await typeParameterRepository.remove(typeParameters);
  }
}