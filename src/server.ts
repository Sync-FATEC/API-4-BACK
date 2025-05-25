import 'dotenv/config';
import 'reflect-metadata';
import http from 'http';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { initializeDatabase, closeDatabase } from './infrastructure/database/initialize';
import { authRoutes } from './web/routes/auth.routes';
import { responseHandler } from './infrastructure/middlewares/responseHandler';
import { userRoutes } from './web/routes/user.routes';
import { stationRoutes } from './web/routes/station.routes';
import { typeAlertRoutes } from './web/routes/typeAlert.routes';
import { typeParameterRoutes } from './web/routes/typeParameter.routes';
import { parameterRoutes } from './web/routes/parameter.routes';
import { errorMiddleware } from './web/middlewares/errorMiddleware';
import { measureRoutes } from './web/routes/Measure.routes';
import { receiverJsonRoutes } from './web/routes/receiverJson.routes';
import { swaggerOptions } from './swaggetOptions';
import { emailStationRoutes } from './web/routes/emailStation.router';
import { CronManager } from './infrastructure/nodeCron/CronManager';
import { createSocketServer, getNotificationService } from './infrastructure/websocket/socket';
import measureAverageRoutes from './web/routes/MeasureAverage.routes';
import { dashboardRoutes } from './web/routes/dashboard.routes';
import { passwordResetRoutes } from './web/routes/password-reset.routes';
import { alertRoutes } from './web/routes/Alert.routes';
const swaggerSpec = swaggerJsdoc(swaggerOptions);
export const app = express();
app.use(cors());
app.use(express.json());
app.use(responseHandler);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/typeAlert", typeAlertRoutes);
app.use("/station", stationRoutes);
app.use("/typeParameter", typeParameterRoutes);
app.use("/measure", measureRoutes);
app.use("/alert", alertRoutes);
app.use("/parameter", parameterRoutes);
app.use("/receiverJson", receiverJsonRoutes);
app.use("/emailStation", emailStationRoutes);
app.use("/measureAverage", measureAverageRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/password-reset", passwordResetRoutes);
app.use(errorMiddleware);

// --- Controle de recursos ---
let server: http.Server | null = null;
let cronManager: CronManager | null = null;

export async function startServer(port = process.env.PORT) {
  try {
    await initializeDatabase();

    const httpServer = http.createServer(app);
    createSocketServer(httpServer);
    const notificationService = getNotificationService();

    cronManager = new CronManager(notificationService);
    cronManager.startAll();

    server = httpServer.listen(port, () => {
      console.log(`🚀 Servidor rodando na porta ${port}`);
      console.log(`📚 Swagger disponível em http://localhost:${port}/api-docs`);
    });

    return server;
  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
    throw error;
  }
}

export async function stopServer() {
  console.log("\nEncerrando servidor...");

  if (server) {
    await new Promise<void>((resolve) => {
      server!.close(() => {
        resolve();
      });
    });
    server = null;
  }

  if (cronManager) {
    cronManager.stopAll();
    console.log("Cron jobs finalizados.");
  }

  await closeDatabase();
  console.log("Conexões de banco encerradas.");

  process.exit(0);
}

process.on('SIGINT', stopServer); // Ctrl+C
process.on('SIGTERM', stopServer); // kill

if (require.main === module) {
  startServer().catch(() => process.exit(1));
}
