import { DataSource } from 'typeorm';
import { Station } from '../../../src/domain/models/entities/Station';
import { randomUUID } from 'crypto';

/**
 * Insere estações de teste no banco de dados
 * @param dataSource Conexão com o banco de dados
 * @returns Array com as estações criadas
 */
export async function runStationSeeds(dataSource: DataSource): Promise<Station[]> {
  const stationRepo = dataSource.getRepository(Station);
  
  // Criar estações de teste
  const stations = [
    stationRepo.create({
      uuid: randomUUID(),
      name: 'Estação Centro',
      latitude: '-23.5505',
      longitude: '-46.6333',
      createdAt: new Date(),
    }),
    stationRepo.create({
      uuid: randomUUID(),
      name: 'Estação Norte',
      latitude: '-23.4856',
      longitude: '-46.7178',
      createdAt: new Date(),
    }),
    stationRepo.create({
      uuid: randomUUID(),
      name: 'Estação Sul',
      latitude: '-23.6245',
      longitude: '-46.6478',
      createdAt: new Date(),
    }),
  ];

  // Salvar estações no banco
  return await stationRepo.save(stations);
}

/**
 * Remove todas as estações do banco de dados
 * @param dataSource Conexão com o banco de dados
 */
export async function clearStationSeeds(dataSource: DataSource): Promise<void> {
  const stationRepo = dataSource.getRepository(Station);
  await stationRepo.clear();
}