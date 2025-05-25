import { AppDataSource } from "../data-source";
import Parameter from "../../../domain/models/agregates/Parameter/Parameter";
import { Station } from "../../../domain/models/entities/Station";
import { TypeParameter } from "../../../domain/models/entities/TypeParameter";
import { In } from "typeorm";

export async function seedParameters() {
    const parameterRepository = AppDataSource.getRepository(Parameter);
    const stationRepository = AppDataSource.getRepository(Station);
    const typeParameterRepository = AppDataSource.getRepository(TypeParameter);

    // Carregar estações e tipos de parâmetros em paralelo
    const [stations, typeParameters] = await Promise.all([
        stationRepository.find(),
        typeParameterRepository.find()
    ]);

    if (stations.length === 0 || typeParameters.length === 0) {
        return;
    }

    // Verificar parâmetros existentes para não duplicar
    const existingParameters = await parameterRepository.find({
        relations: ['idStation', 'idTypeParameter']
    });
    
    // Criar mapa para verificação rápida
    const existingMap = new Map();
    existingParameters.forEach(param => {
        if (param.idStation && param.idTypeParameter) {
            const key = `${param.idStation.id}_${param.idTypeParameter.id}`;
            existingMap.set(key, true);
        }
    });
    
    // Preparar array para inserção em massa
    const parametersToCreate = [];

    // Criar combinações de estações e tipos de parâmetros
    for (const station of stations) {
        for (const typeParameter of typeParameters) {
            const key = `${station.id}_${typeParameter.id}`;
            
            // Verificar se já existe
            if (!existingMap.has(key)) {
                const parameter = parameterRepository.create({
                    idStation: station,
                    idTypeParameter: typeParameter
                });
                parametersToCreate.push(parameter);
            }
        }
    }
    
    // Inserir em massa se houver novos parâmetros
    if (parametersToCreate.length > 0) {
        await parameterRepository.save(parametersToCreate);
    }
} 