import { seedTypeParameters } from "./typeParameter.seed";
import { seedStations } from "./station.seed";
import { seedParameters } from "./parameter.seed";
import { seedTypeAlerts } from "./typeAlert.seed";
import { seedMeasures } from "./measure.seed";
import { seedAlerts } from "./alert.seed";
import { seedMeasureAverages } from "./measureAverage.seed";

export async function runSeeds() {
    try {
        await seedTypeParameters();
        await seedStations();
        await seedParameters();
        await seedTypeAlerts();
        await seedMeasures();
        await seedAlerts();
        await seedMeasureAverages();
        console.log("Todos os seeds foram executados com sucesso!");
    } catch (error) {
        console.error("Erro ao executar seeds:", error);
        throw error;
    }
} 