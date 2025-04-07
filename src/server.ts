import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import './application/operations/receiverMongo/runMongo'
import { initializeDatabase } from './infrastructure/database/initialize';
import { authRoutes } from './web/routes/auth.routes';
import { responseHandler } from './infrastructure/middlewares/responseHandler';
import { userRoutes } from './web/routes/user.routes';
import { stationRoutes } from './web/routes/station.routes';
import { typeAlertRoutes } from './web/routes/typeAlert.routes';
import { typeParameterRoutes } from './web/routes/typeParameter.routes';
import { parameterRoutes } from './web/routes/parameter.routes';
import { errorMiddleware } from './web/middlewares/errorMiddleware';
import { alertRoutes } from './web/routes/Alert.routes';
import { measureRoutes } from './web/routes/Measure.routes';
import { receiverJsonRoutes } from './web/routes/receiverJson.routes';
import { swaggerOptions } from './swaggetOptions';
import { swaggerOptions } from './swaggetOptions';

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Criamos a instância do Express
export const app = express();
// Criamos a instância do Express
export const app = express();

// Configuração de middlewares
app.use(cors());
app.use(express.json());
app.use(responseHandler);
// Configuração de middlewares
app.use(cors());
app.use(express.json());
app.use(responseHandler);

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/typeAlert', typeAlertRoutes);
app.use('/station', stationRoutes);
app.use('/typeParameter', typeParameterRoutes);
app.use('/measure', measureRoutes);
app.use('/alert', alertRoutes);
app.use('/parameter', parameterRoutes);
app.use('/receiverJson', receiverJsonRoutes);
// Rotas da API
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/typeAlert', typeAlertRoutes);
app.use('/station', stationRoutes);
app.use('/typeParameter', typeParameterRoutes);
app.use('/measure', measureRoutes);
app.use('/alert', alertRoutes);
app.use('/parameter', parameterRoutes);
app.use('/receiverJson', receiverJsonRoutes);

// Middleware de erro (deve ser o último)
app.use(errorMiddleware);
// Middleware de erro (deve ser o último)
app.use(errorMiddleware);

let server: any;

export async function startServer(port = process.env.PORT) {
    try {
        await initializeDatabase();

        server = app.listen(port, () => {
            console.log(`🚀 Servidor rodando na porta ${port}`);
            console.log(`📚 Swagger disponível em http://localhost:${port}/api-docs`);
let server: any;

export async function startServer(port = process.env.PORT) {
    try {
        await initializeDatabase();

        server = app.listen(port, () => {
            console.log(`🚀 Servidor rodando na porta ${port}`);
            console.log(`📚 Swagger disponível em http://localhost:${port}/api-docs`);
        });

        return server;

        return server;
    } catch (error) {
        console.error('❌ Erro ao iniciar o servidor:', error);
        throw error;
        console.error('❌ Erro ao iniciar o servidor:', error);
        throw error;
    }
}

export async function stopServer() {
    if (server) {
        await new Promise<void>((resolve) => {
            server.close(() => {
                console.log('Servidor encerrado');
                resolve();
            });
        });
        server = null;
    }
}

if (require.main === module) {
    startServer().catch(() => process.exit(1));
}
