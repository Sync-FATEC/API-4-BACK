import { AppDataSource } from "../data-source";
import { Measure } from "../../../domain/models/entities/Measure";
import { v4 as uuidv4 } from 'uuid';

export async function seedMeasures() {
    const measureRepository = AppDataSource.getRepository(Measure);

    const currentTime = Math.floor(Date.now() / 1000);
    const measures = [
        {
            id: uuidv4(),
            unixTime: currentTime,
            value: 25
        },
        {
            id: uuidv4(),
            unixTime: currentTime - 3600,
            value: 24
        },
        {
            id: uuidv4(),
            unixTime: currentTime - 7200,
            value: 26
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