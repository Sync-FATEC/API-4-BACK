import { app } from '../../src/server';
import { Server } from 'http';

let server: Server;

export default async function globalSetup() {
    server = app.listen(5001, () => {
        console.log('Server started on port 5001');
    });

    // Retorna uma função de limpeza que será chamada após todos os testes
    return async () => {
        await new Promise<void>((resolve) => {
            server.close(() => {
                console.log('Server stopped');
                resolve();
            });
        });
    };
}