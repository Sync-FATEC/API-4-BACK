import { AppDataSource } from "../data-source";
import { Station } from "../../../domain/models/entities/Station";

export async function seedStations(): Promise<void> {
    const stationRepository = AppDataSource.getRepository(Station);

    const stations = [
        {
            uuid: "sao-luiz-do-paraitinga-uid-003",
            name: "Estação de São luiz do paraitinga (A740)",
            latitude: "-23.22833332",
            longitude: "-45.41694443",
            createdAt: new Date()
        },
        {
            uuid: "taubate-uid-002",
            name: "Estação de Taubaté (A728)",
            latitude: "-23.04166666",
            longitude: "-45.52083332",
            createdAt: new Date()
        },
        {
            uuid: "campos-do-jordao-uid-001",
            name: "Estação de Campos do Jordão (A706)",
            latitude: "-22.75027777",
            longitude: "-45.60388888",
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