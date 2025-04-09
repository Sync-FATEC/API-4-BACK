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
  
  // Para cada parâmetro, criar várias medições em diferentes momentos
  for (const parameter of parameters) {
    // Medições da última hora (para testes de médias por hora)
    const typeJson = parameter.idTypeParameter.typeJson;
    
    // Valores base para cada tipo de parâmetro
    let baseValue = 0;
    switch (typeJson) {
      case 'temp':
        baseValue = 25.0;
        break;
      case 'umit':
        baseValue = 65.0;
        break;
      case 'press':
        baseValue = 1013.0;
        break;
      case 'wind':
        baseValue = 10.0;
        break;
      case 'rain':
        baseValue = 0.0;
        break;
      default:
        baseValue = 50.0;
    }
    
    // Medições da última hora
    for (let i = 0; i < 6; i++) {
      const timeOffset = Math.floor(Math.random() * 3600); // Aleatório na última hora
      const measure = measureRepo.create({
        unixTime: now - timeOffset,
        value: baseValue + (Math.random() * 2 - 1), // Variação de +/- 1
        parameter: parameter
      });
      measures.push(measure);
    }
    
    // Algumas medições de 2 horas atrás
    for (let i = 0; i < 3; i++) {
      const timeOffset = Math.floor(Math.random() * 3600); // Aleatório entre 1-2 horas atrás
      const measure = measureRepo.create({
        unixTime: twoHoursAgo - timeOffset,
        value: baseValue + (Math.random() * 4 - 2), // Variação de +/- 2
        parameter: parameter
      });
      measures.push(measure);
    }
    
    // Algumas medições de dias atrás (para testes de médias por dia)
    for (let i = 0; i < 2; i++) {
      const timeOffset = Math.floor(Math.random() * 86400); // Aleatório no último dia
      const measure = measureRepo.create({
        unixTime: threeDaysAgo - timeOffset,
        value: baseValue + (Math.random() * 5 - 2.5), // Variação maior
        parameter: parameter
      });
      measures.push(measure);
    }
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