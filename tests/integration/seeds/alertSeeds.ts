import { DataSource } from 'typeorm';
import { Alert } from '../../../src/domain/models/agregates/Alert/Alert';
import { TypeAlert } from '../../../src/domain/models/agregates/Alert/TypeAlert';
import { Measure } from '../../../src/domain/models/entities/Measure';

/**
 * Insere alertas de teste no banco de dados
 * @param dataSource Conexão com o banco de dados
 * @param typeAlerts Tipos de alertas já criados no banco
 * @param measures Medições já criadas no banco
 * @returns Array com os alertas criados
 */
export async function runAlertSeeds(
  dataSource: DataSource,
  typeAlerts: TypeAlert[],
  measures: Measure[]
): Promise<Alert[]> {
  const alertRepo = dataSource.getRepository(Alert);
  const alerts: Alert[] = [];

  // Para cada tipo de alerta, encontrar medições que acionariam o alerta
  for (const typeAlert of typeAlerts) {
    // Filtrar medições do mesmo parâmetro que o tipo de alerta
    const relevantMeasures = measures.filter(m => 
      m.parameter.id === typeAlert.parameter.id
    );
    
    // Para cada medição relevante, verificar se ela aciona o alerta
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
      
      // Se a medição aciona o alerta, criar um alerta
      if (shouldCreateAlert) {
        const alert = Alert.create(measure.unixTime, typeAlert, measure);
        alerts.push(alert);
      }
    }
  }

  // Salvar alertas no banco
  return await alertRepo.save(alerts);
}

/**
 * Remove todos os alertas do banco de dados
 * @param dataSource Conexão com o banco de dados
 */
export async function clearAlertSeeds(dataSource: DataSource): Promise<void> {
  const alertRepo = dataSource.getRepository(Alert);
  await alertRepo.clear();
}