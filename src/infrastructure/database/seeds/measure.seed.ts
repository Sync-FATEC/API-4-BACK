import { AppDataSource } from "../data-source";
import { Measure } from "../../../domain/models/entities/Measure";
import { v4 as uuidv4 } from 'uuid';
import Parameter from "../../../domain/models/agregates/Parameter/Parameter";

export async function seedMeasures() {
    const measureRepository = AppDataSource.getRepository(Measure);
    const parameterRepository = AppDataSource.getRepository(Parameter);

    const parameters = await parameterRepository.find();

    if (parameters.length === 0) {
        console.log("Necessário ter parameters cadastrados primeiro");
        return;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const measures = [
        {
            id: uuidv4(),
            unixTime: currentTime,
            value: 25,
            parameter: parameters[0]
        },
        {
            id: uuidv4(),
            unixTime: currentTime - 3600,
            value: 24,
            parameter: parameters[0]
        },
        {
            id: uuidv4(),
            unixTime: currentTime - 7200,
            value: 26,
            parameter: parameters[0]
        }
    ];

    for (const measure of measures) {
        const existing = await measureRepository.findOne({
            where: { id: measure.id }
        });

        if (!existing) {
            await measureRepository.save(measure);
        }
    }
} 