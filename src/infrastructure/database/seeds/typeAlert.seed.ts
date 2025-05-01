import { AppDataSource } from "../data-source";
import { TypeAlert } from "../../../domain/models/agregates/Alert/TypeAlert";
import Parameter from "../../../domain/models/agregates/Parameter/Parameter";
import { ComparisonOperator } from "../../../domain/enums/TypeAlert/ComparisonOperator";
import { Criticality } from "../../../domain/enums/TypeAlert/Criticality";
import { In } from "typeorm";
import { Station } from "../../../domain/models/entities/Station";

export async function seedTypeAlerts() {
    const typeAlertRepository = AppDataSource.getRepository(TypeAlert);
    const parameterRepository = AppDataSource.getRepository(Parameter);
    const stationRepository = AppDataSource.getRepository(Station);

    // Buscar todas as estações
    const stations = await stationRepository.find();
    
    // Carregar parâmetros com suas relações
    const parameters = await parameterRepository.find({
        relations: ['idTypeParameter', 'idStation']
    });

    if (parameters.length === 0 || stations.length === 0) {
        console.log("Sem parâmetros ou estações cadastrados. Não é possível continuar.");
        return;
    }

    // Agrupar parâmetros por estação
    const stationParameters = {};
    
    parameters.forEach(parameter => {
        if (!parameter.idStation || !parameter.idTypeParameter) return;
        
        const stationId = parameter.idStation.id;
        const stationName = parameter.idStation.name;
        
        if (!stationParameters[stationId]) {
            stationParameters[stationId] = {
                stationName: stationName,
                parameters: {}
            };
        }
        
        stationParameters[stationId].parameters[parameter.idTypeParameter.typeJson] = parameter;
    });
    
    // Verificar alertas existentes de uma vez só
    const existingAlerts = await typeAlertRepository.find({
        relations: ['parameter']
    });
    
    // Criar mapa para verificação rápida
    const existingAlertsMap = new Map();
    existingAlerts.forEach(alert => {
        const key = `${alert.name}_${alert.parameter.id}`;
        existingAlertsMap.set(key, true);
    });
    
    // Preparar todos os alertas para inserção em massa
    const alertsToCreate = [];

    // Mensagens específicas por estação e tipo de alerta
    const alertMessages = {
        // 1. Chuva Intensa
        "chuva": {
            "Estação de Taubaté": "Chuva intensa. Risco de alagamentos no Centro e Vila São José. Evite ruas inundadas e proteja pertences.",
            "Estação de São Luiz do Paraitinga": "Chuva intensa. Risco de transbordamento do Rio Paraitinga. Evite travessias e áreas de risco.",
            "Estação de Campos do Jordão": "Chuva intensa. Risco de quedas de barreiras. Evite trilhas e estradas expostas.",
            "default": "Chuva intensa. Risco de alagamentos e deslizamentos. Evite áreas de risco."
        },
        
        // 2. Baixa Umidade
        "umidade": {
            "Estação de Taubaté": "Baixa umidade do ar. Evite exposição prolongada ao sol. Risco de problemas respiratórios.",
            "Estação de São Luiz do Paraitinga": "Baixa umidade do ar. Alto risco de incêndios. Não realize queimadas e mantenha hidratação.",
            "Estação de Campos do Jordão": "Baixa umidade do ar. Hidrate-se e use proteção para vias respiratórias.",
            "default": "Baixa umidade do ar. Hidrate-se com frequência. Risco de incêndios."
        },
        
        // 3. Onda de Calor
        "calor": {
            "Estação de Taubaté": "Temperatura elevada. Risco de hipertermia. Evite exposição ao sol e mantenha-se hidratado.",
            "Estação de São Luiz do Paraitinga": "Temperatura elevada. Alta sensação térmica. Evite esforços físicos.",
            "Estação de Campos do Jordão": "Temperatura elevada, incomum para a região. Evite atividades intensas.",
            "default": "Temperatura elevada. Evite exposição ao sol em horários críticos e mantenha-se hidratado."
        },
        
        // 4. Frio Intenso
        "frio": {
            "Estação de Taubaté": "Temperatura baixa. Risco para saúde. Mantenha-se aquecido e proteja idosos e crianças.",
            "Estação de São Luiz do Paraitinga": "Temperatura baixa. Evite exposição prolongada ao frio. Aqueça ambientes.",
            "Estação de Campos do Jordão": "Temperatura baixa. Risco de geada. Proteja-se adequadamente.",
            "default": "Temperatura baixa. Use agasalhos e proteja-se do frio."
        },
        
        // 5. Ventos Fortes
        "vento": {
            "Estação de Taubaté": "Ventos fortes. Risco de quedas de árvores e danos em telhados. Evite áreas abertas.",
            "Estação de São Luiz do Paraitinga": "Ventos fortes. Risco em áreas rurais e encostas. Fixe estruturas leves.",
            "Estação de Campos do Jordão": "Ventos fortes. Risco elevado na serra. Evite trilhas expostas.",
            "default": "Ventos fortes. Cuidado com objetos soltos e quedas de árvores."
        }
    };

    // Definições dos limiares de alerta
    const thresholds = {
        "temperatura": {
            "alta": {
                "Estação de Taubaté": 35,
                "Estação de São Luiz do Paraitinga": 35,
                "Estação de Campos do Jordão": 32,
                "default": 35
            },
            "baixa": {
                "Estação de Taubaté": 5,
                "Estação de São Luiz do Paraitinga": 5,
                "Estação de Campos do Jordão": 2,
                "default": 5
            }
        },
        "umidade": 20,
        "rainfall": 20,
        "windSpeed": 11
    };

    // Iterar sobre cada estação e criar os alertas para cada uma
    for (const stationId in stationParameters) {
        const station = stationParameters[stationId];
        const stationName = station.stationName;
        
        // Alertas para criar para esta estação
        const stationAlerts = [];
        
        // 1. CHUVA INTENSA
        if (station.parameters.rainfall) {
            stationAlerts.push({
                name: "Chuva Intensa",
                value: thresholds.rainfall,
                comparisonOperator: ComparisonOperator.GREATER_THAN,
                parameter: station.parameters.rainfall,
                criticality: Criticality.HIGH,
                description: alertMessages.chuva[stationName] || alertMessages.chuva.default
            });
        }
        
        // 2. BAIXA UMIDADE
        if (station.parameters.humidity) {
            stationAlerts.push({
                name: "Baixa Umidade",
                value: thresholds.umidade,
                comparisonOperator: ComparisonOperator.LESS_THAN,
                parameter: station.parameters.humidity,
                criticality: Criticality.HIGH,
                description: alertMessages.umidade[stationName] || alertMessages.umidade.default
            });
        }
        
        // 3. ONDA DE CALOR
        if (station.parameters.temperature) {
            stationAlerts.push({
                name: "Onda de Calor",
                value: thresholds.temperatura.alta[stationName] || thresholds.temperatura.alta.default,
                comparisonOperator: ComparisonOperator.GREATER_THAN,
                parameter: station.parameters.temperature,
                criticality: Criticality.HIGH,
                description: alertMessages.calor[stationName] || alertMessages.calor.default
            });
            
            // 4. FRIO INTENSO
            stationAlerts.push({
                name: "Frio Intenso",
                value: thresholds.temperatura.baixa[stationName] || thresholds.temperatura.baixa.default,
                comparisonOperator: ComparisonOperator.LESS_THAN,
                parameter: station.parameters.temperature,
                criticality: Criticality.HIGH,
                description: alertMessages.frio[stationName] || alertMessages.frio.default
            });
        }
        
        // 5. VENTOS FORTES
        if (station.parameters.windSpeed) {
            stationAlerts.push({
                name: "Ventos Fortes",
                value: thresholds.windSpeed,
                comparisonOperator: ComparisonOperator.GREATER_THAN,
                parameter: station.parameters.windSpeed,
                criticality: Criticality.HIGH,
                description: alertMessages.vento[stationName] || alertMessages.vento.default
            });
        }

        // Adicionar alertas não existentes
        for (const alert of stationAlerts) {
            if (!alert.parameter) continue;

            const key = `${alert.name}_${alert.parameter.id}`;
            if (!existingAlertsMap.has(key)) {
                alertsToCreate.push(alert);
            }
        }
    }
    
    // Inserir todos os alertas de uma vez, se houver novos
    if (alertsToCreate.length > 0) {
        await typeAlertRepository.save(alertsToCreate);
        console.log(`${alertsToCreate.length} novos alertas criados.`);
    } else {
        console.log("Nenhum novo alerta para criar.");
    }
} 