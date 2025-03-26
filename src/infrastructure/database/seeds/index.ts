import { seedTypeParameters } from "./typeParameter.seed";
import { seedStations } from "./station.seed";
import { seedParameters } from "./parameter.seed";
import { seedTypeAlerts } from "./typeAlert.seed";
import { seedMeasures } from "./measure.seed";
import { seedAlerts } from "./alert.seed";

export async function runSeeds() {
    try {
        console.log("Iniciando seeds...");
        
        await seedTypeParameters();
        console.log("TypeParameters seed concluído");
        
        await seedStations();
        console.log("Stations seed concluído");
        
        await seedParameters();
        console.log("Parameters seed concluído");
        
        await seedTypeAlerts();
        console.log("TypeAlerts seed concluído");
        
        await seedMeasures();
        console.log("Measures seed concluído");
        
        await seedAlerts();
        console.log("Alerts seed concluído");
        
        console.log("Todos os seeds foram executados com sucesso!");
    } catch (error) {
        console.error("Erro ao executar seeds:", error);
        throw error;
    }
} 