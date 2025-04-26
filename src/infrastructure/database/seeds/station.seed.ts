import { AppDataSource } from "../data-source";
import { Station } from "../../../domain/models/entities/Station";
import { v4 as uuidv4 } from 'uuid';

export async function seedStations() {
    const stationRepository = AppDataSource.getRepository(Station);

    const stations = [
        {
            uuid: "e643b48d-8dcd-4c4e-b5b5-611a5bb66fc8",
            name: "Estação Central",
            latitude: "-23.550520",
            longitude: "-46.633308",
            createdAt: new Date()
        },
        {
            uuid: "f296aa48-dedb-4354-ac7d-a91f71de2f84",
            name: "Estação Norte",
            latitude: "-23.450520",
            longitude: "-46.533308",
            createdAt: new Date()
        },
        {
            uuid: "67fa2d5d-6ef2-4cc1-b466-999166ec15d2",
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