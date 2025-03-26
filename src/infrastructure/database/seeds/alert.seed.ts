import { AppDataSource } from "../data-source";
import { Alert } from "../../../domain/models/agregates/Alert/Alert";
import { TypeAlert } from "../../../domain/models/agregates/Alert/TypeAlert";
import { Measure } from "../../../domain/models/entities/Measure";

export async function seedAlerts() {
    const alertRepository = AppDataSource.getRepository(Alert);
    const typeAlertRepository = AppDataSource.getRepository(TypeAlert);
    const measureRepository = AppDataSource.getRepository(Measure);

    const typeAlerts = await typeAlertRepository.find();
    const measures = await measureRepository.find();

    if (typeAlerts.length === 0 || measures.length === 0) {
        console.log("Necessário ter typeAlerts e measures cadastrados primeiro");
        return;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const alerts = [
        {
            date: currentTime,
            type: typeAlerts[0], // Temperatura Alta
            measure: measures[0]
        },
        {
            date: currentTime - 3600,
            type: typeAlerts[1], // Temperatura Baixa
            measure: measures[1]
        },
        {
            date: currentTime - 7200,
            type: typeAlerts[2], // Umidade Alta
            measure: measures[2]
        }
    ];

    for (const alert of alerts) {
        const existing = await alertRepository.findOne({
            where: {
                date: alert.date,
                type: { id: alert.type.id },
                measure: { id: alert.measure.id }
            }
        });

        if (!existing) {
            await alertRepository.save(alert);
        }
    }
} 