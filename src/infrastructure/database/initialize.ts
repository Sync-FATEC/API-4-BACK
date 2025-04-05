import { AppDataSource } from './data-source';
import { runSeeds } from './seeds';
import { seedAdminUser } from './seeds/AdminUserSeed';

export async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        
        await seedAdminUser(AppDataSource)

    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
        process.exit(1);
    }
} 