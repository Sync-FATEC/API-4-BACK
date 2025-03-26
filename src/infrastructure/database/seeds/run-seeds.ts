import { AppDataSource } from "../data-source";
import { runSeeds } from "./index";

async function main() {
    try {
        await AppDataSource.initialize();
        console.log("Conexão com o banco de dados estabelecida");
        
        await runSeeds();
        
        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados fechada");
    } catch (error) {
        console.error("Erro:", error);
        process.exit(1);
    }
}

main(); 