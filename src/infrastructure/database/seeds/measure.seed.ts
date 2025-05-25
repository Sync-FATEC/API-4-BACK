import { AppDataSource } from "../data-source";
import { Measure } from "../../../domain/models/entities/Measure";
import { v4 as uuidv4 } from 'uuid';
import Parameter from "../../../domain/models/agregates/Parameter/Parameter";
import * as fs from 'fs';
import * as path from 'path';
import { Station } from "../../../domain/models/entities/Station";
import { TypeParameter } from "../../../domain/models/entities/TypeParameter";
import { In } from "typeorm";

export async function seedMeasures() {
    const measureRepository = AppDataSource.getRepository(Measure);
    const parameterRepository = AppDataSource.getRepository(Parameter);
    const stationRepository = AppDataSource.getRepository(Station);
    const typeParameterRepository = AppDataSource.getRepository(TypeParameter);

    // Carregando todos os parâmetros, estações e tipos de parâmetros de uma vez
    const [parameters, stations, typeParameters] = await Promise.all([
        parameterRepository.find({
            relations: ['idStation', 'idTypeParameter']
        }),
        stationRepository.find(),
        typeParameterRepository.find()
    ]);

    if (parameters.length === 0) {
        return;
    }

    // Verificar estações carregadas
    stations.forEach(station => {
    });

    // Mapeando estações por uuid para acesso rápido
    const stationMap = new Map();
    stations.forEach(station => {
        stationMap.set(station.uuid, station);
    });
    
    // Verificar se as estações principais estão no mapa
    const principaisUIDs = ["sjc-uid-123", "cacapava-uid-456", "taubate-uid-123"];
    principaisUIDs.forEach(uid => {
    });
    
    // Adicionar variações de UIDs manualmente
    const variacoes = {
        "sjc-uid-123": ["sjc-uid-001", "sjc-uid-002", "sjc-uid-003"],
        "cacapava-uid-456": ["cacapava-uid-001", "cacapava-uid-002", "cacapava-uid-003"],
        "taubate-uid-123": ["taubate-uid-001", "taubate-uid-002", "taubate-uid-003"]
    };
    
    // Adicionar mapeamentos para variações de UIDs
    for (const [principal, aliases] of Object.entries(variacoes)) {
        const estacaoPrincipal = stationMap.get(principal);
        if (estacaoPrincipal) {
            for (const alias of aliases) {
                stationMap.set(alias, estacaoPrincipal);
            }
        } else {
            console.error(`ERRO: Estação principal ${principal} não encontrada para mapear aliases`);
        }
    }

    // Mapeando tipos de parâmetros por typeJson para acesso rápido
    const typeParameterMap = new Map();
    typeParameters.forEach(tp => {
        typeParameterMap.set(tp.typeJson, tp);
    });

    // Mapeando parâmetros para acesso rápido por estação e tipo
    const parameterMap = new Map();
    parameters.forEach(param => {
        if (param.idStation && param.idTypeParameter) {
            const key = `${param.idStation.id}_${param.idTypeParameter.id}`;
            parameterMap.set(key, param);
        }
    });

    // Caminho para os arquivos JSON
    const bigDataFolderPath = path.join(__dirname, 'bigData');
    const jsonFiles = [
        'estacao_sao_luiz_do_paraitinga_bigdata.json',
        'estacao_campos_do_jordao_bigdata.json',
        'estacao_taubate_bigdata.json'
    ];

    // Tipos de parâmetros a serem processados
    const parameterTypes = ['temperature', 'humidity', 'pressure', 'windSpeed', 'rainfall'];
    
    // Verificar arquivos antes de processar
    for (const jsonFile of jsonFiles) {
        const filePath = path.join(bigDataFolderPath, jsonFile);
        if (fs.existsSync(filePath)) {
            console.log(`Arquivo encontrado: ${jsonFile}`);
        } else {
            console.error(`ERRO: Arquivo não encontrado: ${jsonFile}`);
        }
    }
    
    // Contadores para estatísticas
    const stats = {
        totalProcessados: 0,
        porEstacao: {
            'campos-do-jordao-uid-001': 0,
            'sao-luiz-do-paraitinga-uid-003': 0,
            'taubate-uid-002': 0
        },
        uidsEncontrados: new Set(),
        uidsNaoEncontrados: new Set()
    };
    
    // Processar cada arquivo
    for (const jsonFile of jsonFiles) {
        const filePath = path.join(bigDataFolderPath, jsonFile);

        try {
            // Ler o conteúdo do arquivo
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const jsonData = JSON.parse(fileContent);

            console.log(`Processando ${jsonFile}: ${jsonData.length} registros`);
            
            // Amostra de UIDs no arquivo
            if (jsonData.length > 0) {
                const uidsSample = new Set();
                for (let i = 0; i < Math.min(5, jsonData.length); i++) {
                    uidsSample.add(jsonData[i].uid);
                }
                console.log(`UIDs de amostra em ${jsonFile}: ${Array.from(uidsSample).join(', ')}`);
            }

            // Processamento em lotes maiores
            const batchSize = 500;
            const totalBatches = Math.ceil(jsonData.length / batchSize);

            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                const start = batchIndex * batchSize;
                const end = Math.min(start + batchSize, jsonData.length);
                const batch = jsonData.slice(start, end);
                
                // Preparar inserções em massa
                const measures = [];
                
                for (const record of batch) {
                    const station = stationMap.get(record.uid);
                    if (!station) {
                        if (!stats.uidsNaoEncontrados.has(record.uid)) {
                            stats.uidsNaoEncontrados.add(record.uid);
                            console.error(`Estação não encontrada para uid: ${record.uid}`);
                        }
                        continue;
                    } else {
                        if (!stats.uidsEncontrados.has(record.uid)) {
                            stats.uidsEncontrados.add(record.uid);
                        }
                    }

                    // Mapear para o UUID canônico para estatísticas
                    const canonicalUUID = getCanonicalUUID(record.uid);
                    if (canonicalUUID) {
                        stats.porEstacao[canonicalUUID]++;
                    }
                    stats.totalProcessados++;

                    for (const paramType of parameterTypes) {
                        if (record[paramType] === undefined) continue;
                        
                        const typeParameter = typeParameterMap.get(paramType);
                        if (!typeParameter) continue;

                        const paramKey = `${station.id}_${typeParameter.id}`;
                        const parameter = parameterMap.get(paramKey);
                        if (!parameter) continue;

                        // Criar objeto de medição
                        const measure = new Measure();
                        measure.id = uuidv4();
                        measure.unixTime = record.unixtime;
                        measure.value = record[paramType];
                        measure.parameter = parameter;
                        
                        measures.push(measure);
                    }
                }

                console.log(`Lote ${batchIndex + 1}/${totalBatches}: ${measures.length} medições preparadas`);
                
                if (measures.length === 0) {
                    console.warn(`Aviso: Nenhuma medição gerada para o lote ${batchIndex + 1}/${totalBatches}`);
                    continue;
                }

                // Verificar se já existem medições para este lote
                // Extrair unixTime e parameterId para checar existência
                const unixTimes = Array.from(new Set(measures.map(m => m.unixTime)));
                const parameterIds = Array.from(new Set(measures.map(m => m.parameter.id)));
                
                const existingMeasures = await measureRepository.find({
                    where: {
                        unixTime: In(unixTimes),
                        parameter: { id: In(parameterIds) }
                    },
                    select: ["unixTime", "parameter"],
                    relations: ["parameter"]
                });
                
                // Criar um mapa para verificação rápida de medições existentes
                const existingMap = new Map();
                existingMeasures.forEach(m => {
                    const key = `${m.unixTime}_${m.parameter.id}`;
                    existingMap.set(key, true);
                });
                
                // Filtrar apenas novas medições
                const newMeasures = measures.filter(m => {
                    const key = `${m.unixTime}_${m.parameter.id}`;
                    return !existingMap.has(key);
                });
                
                console.log(`Lote ${batchIndex + 1}/${totalBatches}: ${newMeasures.length}/${measures.length} são novas medições`);
                
                // Inserir em massa se houver novas medições
                if (newMeasures.length > 0) {
                    await measureRepository.save(newMeasures);
                    console.log(`Lote ${batchIndex + 1}/${totalBatches}: ${newMeasures.length} medições salvas com sucesso`);
                }
            }
        } catch (error) {
            console.error(`Erro ao processar o arquivo ${jsonFile}:`, error);
        }
    }
    
    // Exibir estatísticas
    console.log("\n=== ESTATÍSTICAS DE PROCESSAMENTO ===");
    console.log(`Total de registros processados: ${stats.totalProcessados}`);
    console.log("Por estação:");
    console.log(`- São Luiz do Paraitinga: ${stats.porEstacao['sao-luiz-do-paraitinga-uid-003']}`);
    console.log(`- Campos do Jordão: ${stats.porEstacao['campos-do-jordao-uid-001']}`);
    console.log(`- Taubaté: ${stats.porEstacao['taubate-uid-002']}`);
    console.log(`UIDs encontrados (distintos): ${stats.uidsEncontrados.size}`);
    console.log(`UIDs não encontrados (distintos): ${stats.uidsNaoEncontrados.size}`);
    console.log("===================================");
}

// Função auxiliar para mapear diferentes IDs para o ID canônico da estação
function getCanonicalUUID(uid: string): string | null {
    if (uid.startsWith('sao-luiz-uid')) {
        return 'sao-luiz-do-paraitinga-uid-003';
    } else if (uid.startsWith('campos-do-jordao-uid')) {
        return 'campos-do-jordao-uid-001';
    } else if (uid.startsWith('taubate-uid')) {
        return 'taubate-uid-002';
    }
    return null;
} 