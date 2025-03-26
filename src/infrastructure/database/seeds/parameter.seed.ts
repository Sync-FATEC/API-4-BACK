import { AppDataSource } from "../data-source";
import Parameter from "../../../domain/models/agregates/Parameter/Parameter";
import { Station } from "../../../domain/models/entities/Station";
import { TypeParameter } from "../../../domain/models/entities/TypeParameter";

export async function seedParameters() {
    const parameterRepository = AppDataSource.getRepository(Parameter);
    const stationRepository = AppDataSource.getRepository(Station);
    const typeParameterRepository = AppDataSource.getRepository(TypeParameter);

    const stations = await stationRepository.find();
    const typeParameters = await typeParameterRepository.find();

    if (stations.length === 0 || typeParameters.length === 0) {
        console.log("Necessário ter stations e typeParameters cadastrados primeiro");
        return;
    }

    for (const station of stations) {
        for (const typeParameter of typeParameters) {
            const existing = await parameterRepository.findOne({
                where: {
                    idStation: { id: station.id },
                    idTypeParameter: { id: typeParameter.id }
                }
            });

            if (!existing) {
                const parameter = parameterRepository.create({
                    idStation: station,
                    idTypeParameter: typeParameter
                });
                await parameterRepository.save(parameter);
            }
        }
    }
} 