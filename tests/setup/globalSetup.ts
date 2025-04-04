import { app } from '../../src/server';
import { Server } from 'http';

let server: Server;

async function startServer() {
    server = app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
    return server;
}

async function stopServer() {
    return new Promise<void>((resolve) => {
        server.close(() => {
            resolve();
        });
    });
}

export default async function globalSetup() {
    await startServer();
    await stopServer(); 
};
