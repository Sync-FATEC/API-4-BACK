import { AppDataSource } from "../../../infrastructure/database/data-source";
import { gerarPdfEstacoes } from "./generateStationReport";
import { Station } from "../../../domain/models/entities/Station";

async function main() {
  try {
    // Inicializar a conexão com o banco de dados
    await AppDataSource.initialize();
    console.log("Conexão com o banco de dados inicializada");

    // Buscar o ID de uma estação para teste
    const stationRepository = AppDataSource.getRepository(Station);
    const station = await stationRepository.findOne({});

    if (!station) {
      console.error("Nenhuma estação encontrada no banco de dados");
      return;
    }

    console.log(`Gerando relatório para a estação com ID: ${station.id}`);
    
    // Gerar o relatório PDF
    await gerarPdfEstacoes(station.id);
    
    console.log("Relatório gerado com sucesso!");
  } catch (error) {
    console.error("Erro ao gerar o relatório:", error);
  } finally {
    // Fechar a conexão com o banco de dados
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("Conexão com o banco de dados fechada");
    }
  }
}

main();