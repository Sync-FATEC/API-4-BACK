import { AppDataSource } from "../data-source";
import { Alert } from "../../../domain/models/agregates/Alert/Alert";
import { TypeAlert } from "../../../domain/models/agregates/Alert/TypeAlert";
import { Measure } from "../../../domain/models/entities/Measure";
import { ComparisonOperator } from "../../../domain/enums/TypeAlert/ComparisonOperator";
import { In } from "typeorm";

export async function seedAlerts() {
    const alertRepository = AppDataSource.getRepository(Alert);
    const typeAlertRepository = AppDataSource.getRepository(TypeAlert);
    const measureRepository = AppDataSource.getRepository(Measure);

    // Carregar os tipos de alertas com parâmetros relacionados
    const typeAlerts = await typeAlertRepository.find({
        relations: ['parameter']
    });

    if (typeAlerts.length === 0) {
        return;
    }

    // Agrupar tipos de alertas por parâmetro para processamento mais eficiente
    const alertsByParameter = new Map();
    typeAlerts.forEach(typeAlert => {
        if (!typeAlert.parameter) return;
        
        const parameterId = typeAlert.parameter.id;
        if (!alertsByParameter.has(parameterId)) {
            alertsByParameter.set(parameterId, []);
        }
        alertsByParameter.get(parameterId).push(typeAlert);
    });

    // Arrays para armazenar os alertas a serem criados
    const alertsToCreate = [];
    // Conjunto para evitar duplicatas
    const alertKeys = new Set();

    // Processar medições em lotes para evitar esgotar a memória
    const batchSize = 1000;
    let offset = 0;
    let hasMoreMeasures = true;

    while (hasMoreMeasures) {
        // Buscar um lote de medições com seus parâmetros
        const measures = await measureRepository.find({
            relations: ['parameter'],
            skip: offset,
            take: batchSize
        });

        if (measures.length === 0) {
            hasMoreMeasures = false;
            continue;
        }

        // Processar cada medição no lote
        for (const measure of measures) {
            if (!measure.parameter) continue;

            // Obter os tipos de alerta associados ao parâmetro da medição
            const relevantAlerts = alertsByParameter.get(measure.parameter.id) || [];
            
            // Verificar cada tipo de alerta
            for (const typeAlert of relevantAlerts) {
                // Aplicar a lógica de comparação com base no operador
                let alertTriggered = false;
                
                switch (typeAlert.comparisonOperator) {
                    case ComparisonOperator.EQUAL:
                        alertTriggered = measure.value === typeAlert.value;
                        break;
                    case ComparisonOperator.GREATER_THAN:
                        alertTriggered = measure.value > typeAlert.value;
                        break;
                    case ComparisonOperator.LESS_THAN:
                        alertTriggered = measure.value < typeAlert.value;
                        break;
                    default:
                        continue;
                }
                
                // Se o alerta foi acionado, criar um registro de alerta
                if (alertTriggered) {
                    // Chave única para evitar duplicatas
                    const alertKey = `${typeAlert.id}_${measure.id}`;
                    
                    // Verificar se já adicionamos este alerta
                    if (!alertKeys.has(alertKey)) {
                        alertKeys.add(alertKey);
                        
                        // Criar o alerta
                        const alert = Alert.create(measure.unixTime, typeAlert, measure);
                        
                        alertsToCreate.push(alert);
                    }
                }
            }
        }
        
        // Avançar para o próximo lote
        offset += batchSize;
    }

    // Verificar se há alertas existentes para não duplicar
    if (alertsToCreate.length > 0) {
        // Obter IDs dos alertas a serem verificados
        const typeAlertIds = Array.from(new Set(alertsToCreate.map(a => a.type.id)));
        const measureIds = Array.from(new Set(alertsToCreate.map(a => a.measure.id)));
        
        // Buscar alertas existentes
        const existingAlerts = await alertRepository.find({
            where: {
                type: { id: In(typeAlertIds) },
                measure: { id: In(measureIds) }
            },
            relations: ['type', 'measure']
        });
        
        // Criar um mapa para verificação rápida
        const existingMap = new Map();
        existingAlerts.forEach(alert => {
            const key = `${alert.type.id}_${alert.measure.id}`;
            existingMap.set(key, true);
        });
        
        // Filtrar apenas os novos alertas
        const newAlerts = alertsToCreate.filter(alert => {
            const key = `${alert.type.id}_${alert.measure.id}`;
            return !existingMap.has(key);
        });
        
        // Salvar os novos alertas em lote
        if (newAlerts.length > 0) {
            await alertRepository.save(newAlerts);
        }
    }
} 