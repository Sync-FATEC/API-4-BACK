import { AppDataSource } from "../data-source";
import { TypeParameter } from "../../../domain/models/entities/TypeParameter";

export async function seedTypeParameters() {
    const typeParameterRepository = AppDataSource.getRepository(TypeParameter);

    const typeParameters = [
        {
            typeJson: "temperature",
            name: "Temperatura",
            unit: "°C",
            numberOfDecimalsCases: 2,
            factor: 1,
            offset: 0
        },
        {
            typeJson: "humidity",
            name: "Umidade",
            unit: "%",
            numberOfDecimalsCases: 2,
            factor: 1,
            offset: 0
        },
        {
            typeJson: "pressure",
            name: "Pressão",
            unit: "hPa",
            numberOfDecimalsCases: 2,
            factor: 1,
            offset: 0
        },
        {
            typeJson: "windSpeed",
            name: "Velocidade do Vento",
            unit: "m/s",
            numberOfDecimalsCases: 2,
            factor: 1,
            offset: 0
        },
        {
            typeJson: "rainfall",
            name: "Precipitação",
            unit: "mm",
            numberOfDecimalsCases: 2,
            factor: 1,
            offset: 0
        }
    ];

    for (const typeParameter of typeParameters) {
        const existing = await typeParameterRepository.findOne({
            where: { typeJson: typeParameter.typeJson }
        });

        if (!existing) {
            await typeParameterRepository.save(typeParameter);
        }
    }
} 