import { startServer as startAppServer } from '../../src/server';
import { Server } from 'http';

export let server: Server;

async function startServer() {
    server = await startAppServer(String(3000));
    return server;
}

export default async function globalSetup() {
    await startServer();
}
