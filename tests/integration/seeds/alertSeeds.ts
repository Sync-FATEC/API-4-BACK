import { DataSource } from 'typeorm';
import { Alert } from '../../../src/domain/models/agregates/Alert/Alert';
import { TypeAlert } from '../../../src/domain/models/agregates/Alert/TypeAlert';
import { Measure } from '../../../src/domain/models/entities/Measure';

export async function runAlertSeeds(
  dataSource: DataSource,
  typeAlerts: TypeAlert[],
  measures: Measure[]
): Promise<Alert[]> {
  const alertRepo = dataSource.getRepository(Alert);
  const alerts: Alert[] = [];

  for (const typeAlert of typeAlerts) {
    const relevantMeasures = measures.filter(m => 
      m.parameter.id === typeAlert.parameter.id
    );
    
    for (const measure of relevantMeasures) {
      let shouldCreateAlert = false;
      
      switch (typeAlert.comparisonOperator) {
        case '=':
          shouldCreateAlert = measure.value === typeAlert.value;
          break;
        case '>':
          shouldCreateAlert = measure.value > typeAlert.value;
          break;
        case '<':
          shouldCreateAlert = measure.value < typeAlert.value;
          break;
      }
      
      if (shouldCreateAlert) {
        const alert = Alert.create(measure.unixTime, typeAlert, measure);
        alerts.push(alert);
      }
    }
  }

  return await alertRepo.save(alerts);
}

export async function clearAlertSeeds(dataSource: DataSource): Promise<void> {
  const alertRepository = dataSource.getRepository(Alert);
  
  const alerts = await alertRepository.find();
  
  if (alerts.length > 0) {
    await alertRepository.remove(alerts);
  }
}