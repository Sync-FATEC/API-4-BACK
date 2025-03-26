import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './infrastructure/database/initialize';
import { authRoutes } from './web/routes/auth.routes';
import { responseHandler } from './infrastructure/middlewares/responseHandler';
import { userRoutes } from './web/routes/user.routes';
import { stationRoutes } from './web/routes/station.routes';
import { typeAlertRoutes } from './web/routes/typeAlert.routes';
import { typeParameterRoutes } from './web/routes/typeParameter.routes';
import { measureRoutes } from './web/routes/Measure.routes';
import { alertRoutes } from './web/routes/Alert.routes';
import { parameterRoutes } from './web/routes/parameter.routes';
import { errorMiddleware } from './web/middlewares/errorMiddleware';

async function bootstrap() {
    try {
        const app = express();

        // Middlewares básicos
        app.use(cors());
        app.use(express.json());
        app.use(responseHandler);

        // Inicializar banco de dados
        await initializeDatabase();

        // Rotas
        app.use('/auth', authRoutes);
        app.use('/user', userRoutes);
        app.use('/typeAlert', typeAlertRoutes);
        app.use('/station', stationRoutes);
        app.use('/typeParameter', typeParameterRoutes);
        app.use('/measure', measureRoutes);
        app.use('/alert', alertRoutes);
        app.use('/parameter', parameterRoutes);

        // Middleware de erro deve ser o último
        app.use(errorMiddleware);

        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
}

bootstrap().catch(error => {
    console.error('Erro fatal:', error);
    process.exit(1);
}); 