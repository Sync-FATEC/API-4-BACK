import { AppDataSource } from "../data-source";
import { TypeAlert } from "../../../domain/models/agregates/Alert/TypeAlert";
import Parameter from "../../../domain/models/agregates/Parameter/Parameter";
import { ComparisonOperator } from "../../../domain/enums/TypeAlert/ComparisonOperator";

export async function seedTypeAlerts() {
    const typeAlertRepository = AppDataSource.getRepository(TypeAlert);
    const parameterRepository = AppDataSource.getRepository(Parameter);

    const parameters = await parameterRepository.find({
        relations: ['idTypeParameter']
    });

    if (parameters.length === 0) {
        console.log("Necessário ter parameters cadastrados primeiro");
        return;
    }

    const typeAlerts = [
        {
            name: "Temperatura Alta",
            value: 35,
            comparisonOperator: ComparisonOperator.GREATER_THAN,
            parameter: parameters.find(p => p.idTypeParameter.typeJson === "temperature")
        },
        {
            name: "Temperatura Baixa",
            value: 10,
            comparisonOperator: ComparisonOperator.LESS_THAN,
            parameter: parameters.find(p => p.idTypeParameter.typeJson === "temperature")
        },
        {
            name: "Umidade Alta",
            value: 80,
            comparisonOperator: ComparisonOperator.GREATER_THAN,
            parameter: parameters.find(p => p.idTypeParameter.typeJson === "humidity")
        },
        {
            name: "Umidade Baixa",
            value: 30,
            comparisonOperator: ComparisonOperator.LESS_THAN,
            parameter: parameters.find(p => p.idTypeParameter.typeJson === "humidity")
        },
        {
            name: "Pressão Alta",
            value: 1020,
            comparisonOperator: ComparisonOperator.GREATER_THAN,
            parameter: parameters.find(p => p.idTypeParameter.typeJson === "pressure")
        },
        {
            name: "Pressão Baixa",
            value: 980,
            comparisonOperator: ComparisonOperator.LESS_THAN,
            parameter: parameters.find(p => p.idTypeParameter.typeJson === "pressure")
        }
    ];

    for (const typeAlert of typeAlerts) {
        if (!typeAlert.parameter) continue;

        const existing = await typeAlertRepository.findOne({
            where: {
                name: typeAlert.name,
                parameter: { id: typeAlert.parameter.id }
            }
        });

        if (!existing) {
            await typeAlertRepository.save(typeAlert);
        }
    }
} 