import { AppDataSource } from './data-source';
import { seedAdminUser } from './seeds/AdminUserSeed';

export async function initializeDatabase(): Promise<void> {
    try {
        await AppDataSource.initialize();
        
        await seedAdminUser(AppDataSource)

    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
        process.exit(1);
    }
}

export async function closeDatabase(): Promise<void> {
    await AppDataSource.destroy();
}
