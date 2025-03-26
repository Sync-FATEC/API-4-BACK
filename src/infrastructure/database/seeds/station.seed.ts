import { AppDataSource } from "../data-source";
import { Station } from "../../../domain/models/entities/Station";
import { v4 as uuidv4 } from 'uuid';

export async function seedStations() {
    const stationRepository = AppDataSource.getRepository(Station);

    const stations = [
        {
            uuid: uuidv4(),
            name: "Estação Central",
            latitude: "-23.550520",
            longitude: "-46.633308",
            createdAt: new Date()
        },
        {
            uuid: uuidv4(),
            name: "Estação Norte",
            latitude: "-23.450520",
            longitude: "-46.533308",
            createdAt: new Date()
        },
        {
            uuid: uuidv4(),
            name: "Estação Sul",
            latitude: "-23.650520",
            longitude: "-46.733308",
            createdAt: new Date()
        }
    ];

    for (const station of stations) {
        const existing = await stationRepository.findOne({
            where: { uuid: station.uuid }
        });

        if (!existing) {
            await stationRepository.save(station);
        }
    }
} 