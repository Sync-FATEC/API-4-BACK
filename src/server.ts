import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
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

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Monitoramento',
      version: '1.0.0',
      description: 'API para gerenciamento de estações, parâmetros e alertas',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./swagger.yaml'], // Caminho para o arquivo swagger.yaml
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

async function bootstrap() {
    try {
        const app = express();

        // Middlewares básicos
        app.use(cors());
        app.use(express.json());
        app.use(responseHandler);

        // Configuração do Swagger
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
        app.use('/receiverJson', receiverJsonRoutes);

        // Middleware de erro deve ser o último
        app.use(errorMiddleware);

        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📚 Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
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