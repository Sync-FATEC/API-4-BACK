import { DataSource } from 'typeorm';
import { TypeAlert } from '../../../src/domain/models/agregates/Alert/TypeAlert';
import Parameter from '../../../src/domain/models/agregates/Parameter/Parameter';
import { ComparisonOperator } from '../../../src/domain/enums/TypeAlert/ComparisonOperator';

export async function runTypeAlertSeeds(
  dataSource: DataSource,
  parameters: Parameter[]
): Promise<TypeAlert[]> {
  const typeAlertRepo = dataSource.getRepository(TypeAlert);
  const typeAlerts: TypeAlert[] = [];

  const tempParameters = parameters.filter(p => p.idTypeParameter.typeJson === 'temp');
  const humParameters = parameters.filter(p => p.idTypeParameter.typeJson === 'umit');
  const rainParameters = parameters.filter(p => p.idTypeParameter.typeJson === 'rain');
  
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
  
  for (const humParam of humParameters) {
    const lowHumAlert = typeAlertRepo.create({
      name: `Alerta de Umidade Baixa - ${humParam.idStation.name}`,
      value: 30.0,
      comparisonOperator: ComparisonOperator.LESS_THAN,
      parameter: humParam
    });
    typeAlerts.push(lowHumAlert);
  }
  
  for (const rainParam of rainParameters) {
    const rainAlert = typeAlertRepo.create({
      name: `Alerta de Chuva - ${rainParam.idStation.name}`,
      value: 10.0,
      comparisonOperator: ComparisonOperator.GREATER_THAN,
      parameter: rainParam
    });
    typeAlerts.push(rainAlert);
  }

  return await typeAlertRepo.save(typeAlerts);
}

export async function clearTypeAlertSeeds(dataSource: DataSource): Promise<void> {
  const typeAlertRepository = dataSource.getRepository(TypeAlert);
  
  const typeAlerts = await typeAlertRepository.find();
  
  if (typeAlerts.length > 0) {
    await typeAlertRepository.remove(typeAlerts);
  }
}