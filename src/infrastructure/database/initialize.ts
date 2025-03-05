import { AppDataSource } from './data-source';

export async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        console.log('📦 Conexão com o banco de dados estabelecida');
    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
        process.exit(1);
    }
} 