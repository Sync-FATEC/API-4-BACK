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

async function bootstrap() {
    const app = express();

    app.use(cors());
    app.use(express.json());
    
    // Middleware para padronizar respostas
    app.use(responseHandler);

    // Inicializar banco de dados
    await initializeDatabase();

    // Rotas
    app.use('/auth', authRoutes);
    app.use('/user', userRoutes)
    app.use('/typeAlert', typeAlertRoutes);
    app.use('/station', stationRoutes);

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
}

bootstrap().catch(console.error); 