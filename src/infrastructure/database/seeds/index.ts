import { seedTypeParameters } from "./typeParameter.seed";
import { seedStations } from "./station.seed";
import { seedParameters } from "./parameter.seed";
import { seedTypeAlerts } from "./typeAlert.seed";
import { seedMeasures } from "./measure.seed";
import { seedAlerts } from "./alert.seed";
import { seedAdminUser } from "./AdminUserSeed";
import { AppDataSource } from "../data-source";

export async function runSeeds() {
    try {
        // Primeiro, executar seeds de entidades base em paralelo (não dependem de outras)
        await Promise.all([
            seedTypeParameters(),
            seedStations()
        ]);
        
        // Admin seed precisa do DataSource como parâmetro
        await seedAdminUser(AppDataSource);
        
        // Depois, executar seeds que dependem das entidades base
        await seedParameters();
        
        // Executar seeds de alerta e medições em paralelo
        await Promise.all([
            seedTypeAlerts(),
            seedMeasures()
        ]);
        
        // Por fim, executar seeds que dependem das medições
        await seedAlerts();
        
        console.log("Todos os seeds foram executados com sucesso!");
    } catch (error) {
        console.error("Erro ao executar seeds:", error);
        throw error;
    }
} 