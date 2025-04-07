import { stopServer } from '../../src/server';
import { server } from './globalSetup';
import { mongoClient } from '../../src/infrastructure/database/connectMongo';
import { AppDataSource } from '../../src/infrastructure/database/data-source';

export default async function globalTeardown() {
    // Fechar o servidor HTTP
    if (server) {
        await new Promise<void>((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    } else {
        await stopServer();
    }

    // Fechar conexão com MongoDB
    if (mongoClient) {
        await mongoClient.close();
    }

    // Fechar conexão com PostgreSQL
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }

    process.exit(0);
}