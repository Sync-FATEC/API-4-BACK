import { DataSource } from 'typeorm';
import { Measure } from '../../../src/domain/models/entities/Measure';
import Parameter from '../../../src/domain/models/agregates/Parameter/Parameter';

export async function runMeasureSeeds(
  dataSource: DataSource,
  parameters: Parameter[]
): Promise<Measure[]> {
  const measureRepo = dataSource.getRepository(Measure);
  const measures: Measure[] = [];
  
  const now = Math.floor(Date.now() / 1000);
  const twoHoursAgo = now - 7200;
  const threeDaysAgo = now - 259200;
  
  const fixedValues = {
    'Estação Norte': {
      'temp': [25.1, 25.2, 25.3, 25.0, 25.4],
      'umit': [65.0, 65.1, 65.0, 65.1, 65.0],
      'press': [1013.0, 1013.0, 1012.9, 1012.9, 1013.0],
      'wind': [10.1, 10.0, 10.2, 10.1, 10.0],
      'rain': [0.0, 0.0, 0.0, 0.0, 0.0]
    },
    'Estação Centro': {
      'temp': [25.2, 25.1, 25.3, 25.1, 25.2],
      'umit': [65.2, 65.3, 65.2, 65.2, 65.3],
      'press': [1013.0, 1013.0, 1013.0, 1012.9, 1013.0],
      'wind': [10.1, 10.0, 10.2, 10.1, 10.0],
      'rain': [0.0, 0.0, 0.0, 0.0, 0.0]
    },
    'Estação Sul': {
      'temp': [25.2, 25.3, 25.1, 25.2, 25.2],
      'umit': [65.1, 65.2, 65.1, 65.1, 65.2],
      'press': [1013.3, 1013.3, 1013.3, 1013.3, 1013.3],
      'wind': [10.0, 10.1, 10.0, 10.1, 10.0],
      'rain': [0.0, 0.0, 0.0, 0.0, 0.0]
    }
  };

  for (const parameter of parameters) {
    const stationName = parameter.idStation.name;
    const typeJson = parameter.idTypeParameter.typeJson;
    
    if (!fixedValues[stationName] || !fixedValues[stationName][typeJson]) {
      continue;
    }
    
    const values = fixedValues[stationName][typeJson];
    
    for (let i = 0; i < values.length; i++) {
      const timeOffset = 600 * i;
      const measure = measureRepo.create({
        unixTime: now - timeOffset,
        value: values[i],
        parameter: parameter
      });
      measures.push(measure);
    }
    
    const measure = measureRepo.create({
      unixTime: twoHoursAgo - 1800,
      value: values[0],
      parameter: parameter
    });
    measures.push(measure);
    
    const oldMeasure = measureRepo.create({
      unixTime: threeDaysAgo - 43200,
      value: values[0],
      parameter: parameter
    });
    measures.push(oldMeasure);
  }

  return await measureRepo.save(measures);
}

export async function clearMeasureSeeds(dataSource: DataSource): Promise<void> {
  const measureRepository = dataSource.getRepository(Measure);
  
  const measures = await measureRepository.find();
  
  if (measures.length > 0) {
    await measureRepository.remove(measures);
  }
}