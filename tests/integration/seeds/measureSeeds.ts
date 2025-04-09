import { DataSource } from 'typeorm';
import { Measure } from '../../../src/domain/models/entities/Measure';
import Parameter from '../../../src/domain/models/agregates/Parameter/Parameter';

/**
 * Insere medições de teste no banco de dados
 * @param dataSource Conexão com o banco de dados
 * @param parameters Parâmetros já criados no banco
 * @returns Array com as medições criadas
 */
export async function runMeasureSeeds(
  dataSource: DataSource,
  parameters: Parameter[]
): Promise<Measure[]> {
  const measureRepo = dataSource.getRepository(Measure);
  const measures: Measure[] = [];
  
  // Data atual para referência
  const now = Math.floor(Date.now() / 1000);
  const oneHourAgo = now - 3600;
  const twoHoursAgo = now - 7200;
  const threeDaysAgo = now - 259200; // 3 dias em segundos
  
  // Mapeamento de valores fixos para cada estação e tipo de parâmetro
  // Isso garante que os testes sempre terão os mesmos resultados
  const fixedValues = {
    'Estação Norte': {
      'temp': [25.1, 25.2, 25.3, 25.0, 25.4],  // Média: 25.19
      'umit': [65.0, 65.1, 65.0, 65.1, 65.0],  // Média: 65.04
      'press': [1013.0, 1013.0, 1012.9, 1012.9, 1013.0], // Média: 1012.96
      'wind': [10.1, 10.0, 10.2, 10.1, 10.0],  // Média: 10.09
      'rain': [0.0, 0.0, 0.0, 0.0, 0.0]        // Média: 0.0
    },
    'Estação Centro': {
      'temp': [25.2, 25.1, 25.3, 25.1, 25.2],  // Média: 25.18
      'umit': [65.2, 65.3, 65.2, 65.2, 65.3],  // Média: 65.24
      'press': [1013.0, 1013.0, 1013.0, 1012.9, 1013.0], // Média: 1012.98
      'wind': [10.1, 10.0, 10.2, 10.1, 10.0],  // Média: 10.09
      'rain': [0.0, 0.0, 0.0, 0.0, 0.0]        // Média: 0.0
    },
    'Estação Sul': {
      'temp': [25.2, 25.3, 25.1, 25.2, 25.2],  // Média: 25.21
      'umit': [65.1, 65.2, 65.1, 65.1, 65.2],  // Média: 65.14
      'press': [1013.3, 1013.3, 1013.3, 1013.3, 1013.3], // Média: 1013.31
      'wind': [10.0, 10.1, 10.0, 10.1, 10.0],  // Média: 10.04
      'rain': [0.0, 0.0, 0.0, 0.0, 0.0]        // Média: 0.0
    }
  };

  // Para cada parâmetro, criar medições com valores fixos
  for (const parameter of parameters) {
    const stationName = parameter.idStation.name;
    const typeJson = parameter.idTypeParameter.typeJson;
    
    // Pular se não tivermos valores fixos para esta combinação
    if (!fixedValues[stationName] || !fixedValues[stationName][typeJson]) {
      continue;
    }
    
    const values = fixedValues[stationName][typeJson];
    
    // Medições da última hora (para testes de médias por hora)
    // Usamos intervalos fixos de tempo para garantir consistência
    for (let i = 0; i < values.length; i++) {
      const timeOffset = 600 * i; // 10 minutos * índice (distribuição uniforme na última hora)
      const measure = measureRepo.create({
        unixTime: now - timeOffset,
        value: values[i],
        parameter: parameter
      });
      measures.push(measure);
    }
    
    // Não precisamos de tantas medições para os testes
    // Apenas uma medição de 2 horas atrás para cada parâmetro
    const measure = measureRepo.create({
      unixTime: twoHoursAgo - 1800, // 30 minutos após as 2 horas
      value: values[0], // Usamos o primeiro valor da lista
      parameter: parameter
    });
    measures.push(measure);
    
    // Uma medição de dias atrás (para testes de médias por dia)
    const oldMeasure = measureRepo.create({
      unixTime: threeDaysAgo - 43200, // 12 horas após os 3 dias
      value: values[0], // Usamos o primeiro valor da lista
      parameter: parameter
    });
    measures.push(oldMeasure);
  }

  // Salvar medições no banco
  return await measureRepo.save(measures);
}

/**
 * Remove todas as medições do banco de dados
 * @param dataSource Conexão com o banco de dados
 */
export async function clearMeasureSeeds(dataSource: DataSource): Promise<void> {
  const measureRepo = dataSource.getRepository(Measure);
  await measureRepo.clear();
}