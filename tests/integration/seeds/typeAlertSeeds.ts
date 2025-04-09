import { DataSource } from 'typeorm';
import { TypeAlert } from '../../../src/domain/models/agregates/Alert/TypeAlert';
import Parameter from '../../../src/domain/models/agregates/Parameter/Parameter';
import { ComparisonOperator } from '../../../src/domain/enums/TypeAlert/ComparisonOperator';

/**
 * Insere tipos de alertas de teste no banco de dados
 * @param dataSource Conexão com o banco de dados
 * @param parameters Parâmetros já criados no banco
 * @returns Array com os tipos de alertas criados
 */
export async function runTypeAlertSeeds(
  dataSource: DataSource,
  parameters: Parameter[]
): Promise<TypeAlert[]> {
  const typeAlertRepo = dataSource.getRepository(TypeAlert);
  const typeAlerts: TypeAlert[] = [];

  // Filtrar parâmetros por tipo para criar alertas específicos
  const tempParameters = parameters.filter(p => p.idTypeParameter.typeJson === 'temp');
  const humParameters = parameters.filter(p => p.idTypeParameter.typeJson === 'umit');
  const rainParameters = parameters.filter(p => p.idTypeParameter.typeJson === 'rain');
  
  // Criar alertas de temperatura alta
  for (const tempParam of tempParameters) {
    const highTempAlert = typeAlertRepo.create({
      name: `Alerta de Temperatura Alta - ${tempParam.idStation.name}`,
      value: 30.0,
      comparisonOperator: ComparisonOperator.GREATER_THAN,
      parameter: tempParam
    });
    typeAlerts.push(highTempAlert);
    
    const lowTempAlert = typeAlertRepo.create({
      name: `Alerta de Temperatura Baixa - ${tempParam.idStation.name}`,
      value: 15.0,
      comparisonOperator: ComparisonOperator.LESS_THAN,
      parameter: tempParam
    });
    typeAlerts.push(lowTempAlert);
  }
  
  // Criar alertas de umidade baixa
  for (const humParam of humParameters) {
    const lowHumAlert = typeAlertRepo.create({
      name: `Alerta de Umidade Baixa - ${humParam.idStation.name}`,
      value: 30.0,
      comparisonOperator: ComparisonOperator.LESS_THAN,
      parameter: humParam
    });
    typeAlerts.push(lowHumAlert);
  }
  
  // Criar alertas de chuva
  for (const rainParam of rainParameters) {
    const rainAlert = typeAlertRepo.create({
      name: `Alerta de Chuva - ${rainParam.idStation.name}`,
      value: 10.0,
      comparisonOperator: ComparisonOperator.GREATER_THAN,
      parameter: rainParam
    });
    typeAlerts.push(rainAlert);
  }

  // Salvar tipos de alertas no banco
  return await typeAlertRepo.save(typeAlerts);
}

/**
 * Remove todos os tipos de alertas do banco de dados
 * @param dataSource Conexão com o banco de dados
 */
export async function clearTypeAlertSeeds(dataSource: DataSource): Promise<void> {
  const typeAlertRepo = dataSource.getRepository(TypeAlert);
  await typeAlertRepo.clear();
}