import { AppDataSource } from './data-source';
import { runSeeds } from './seeds';
import { seedAdminUser } from './seeds/AdminUserSeed';

export async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        console.log('📦 Conexão com o banco de dados estabelecida');
        
        await seedAdminUser(AppDataSource)

        console.log('🌱 Seeds executados com sucesso');
    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
        process.exit(1);
    }
} 