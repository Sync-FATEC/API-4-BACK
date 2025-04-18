import { DataSource } from 'typeorm';
import { Station } from '../../../src/domain/models/entities/Station';
import { randomUUID } from 'crypto';

export async function runStationSeeds(dataSource: DataSource): Promise<Station[]> {
  const stationRepo = dataSource.getRepository(Station);
  
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

  return await stationRepo.save(stations);
}

export const clearStationSeeds = async (dataSource: DataSource) => {
  const stationRepository = dataSource.getRepository('Station');
  
  const stations = await stationRepository.find();
  
  if (stations.length > 0) {
    await stationRepository.remove(stations);
  }
};