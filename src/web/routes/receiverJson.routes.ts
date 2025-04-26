import { Router } from "express";
import ReceiverJsonUseCase from "../../application/use-cases/receiverJson/receiverJsonUseCase";
import { AlertRepository } from "../../infrastructure/repositories/AlertRepository";
import { MeasureRepository } from "../../infrastructure/repositories/MeasureRepository";
import StationRepository from "../../infrastructure/repositories/StationRepository";
import TypeAlertRepository from "../../infrastructure/repositories/TypeAlertRepository";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ParameterRepository } from "../../infrastructure/repositories/ParameterRepository";
import { ReceiverJsonController } from "../controllers/receiverJson/receiverJsonController";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import { SenderAlertService } from "../../application/services/SenderAlertService";
import { NotificationService } from "../../infrastructure/websocket/service/NotificationService";
import emailSender from "../../application/operations/email/sendEmailCreatePassword";
import { EmailStationRepository } from "../../infrastructure/repositories/EmailStationRepository";
import { getNotificationService } from "../../infrastructure/websocket/socket";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { ReceiverMongoJsonUseCase } from "../../application/use-cases/receiverJson/receiverMongoUseCase";
import { MongoDbRepository } from "../../infrastructure/repositories/MongoDbRepository";
import { MongoClient } from "mongodb";

const measureRepository = new MeasureRepository();
const stationRepository = new StationRepository();
const alertRepository = new AlertRepository();
const typeAlertRepository = new TypeAlertRepository();
const parameterRepository = new ParameterRepository();
const notificationService = getNotificationService();
const emailStationRepository = new EmailStationRepository();
const userRepository = new UserRepository();

const senderAlert = new SenderAlertService(
  notificationService,
  emailSender,
  emailStationRepository,
  userRepository
);

const receiverJsonUseCase = new ReceiverJsonUseCase(
  stationRepository,
  alertRepository,
  typeAlertRepository,
  measureRepository,
  parameterRepository,
  senderAlert
);

// Inicialização da conexão com MongoDB e setup do controller
let receiverJsonController: ReceiverJsonController;
let mongoDbRepository: MongoDbRepository<any>;
let receiverMongoJsonUseCase: ReceiverMongoJsonUseCase;

// Inicializa a conexão com MongoDB e cria as instâncias necessárias
const initializeMongo = async () => {
  if (process.env.SETUP_RUN === 'test') return;

  try {
    const uri = process.env.MONGO_URL || '';
    const client = new MongoClient(uri);
    await client.connect();
    const dbName = process.env.MONGO_DATABASE;
    const db = client.db(dbName);
    
    mongoDbRepository = new MongoDbRepository<any>(db, 'measures');
    receiverMongoJsonUseCase = new ReceiverMongoJsonUseCase(
      mongoDbRepository,
      stationRepository,
      alertRepository,
      typeAlertRepository,
      measureRepository, 
      parameterRepository, 
      senderAlert
    );
    
    console.log('Conexão com MongoDB estabelecida com sucesso');
  } catch (error) {
    console.error('Erro ao conectar com MongoDB:', error);
  }
};

// Iniciar a conexão com MongoDB
initializeMongo().then(() => {
  receiverJsonController = new ReceiverJsonController(
    receiverJsonUseCase, 
    receiverMongoJsonUseCase
  );
});

const receiverJsonRoutes = Router();

/**
 * @swagger
 * /receiverJson:
 *   post:
 *     summary: Recebe e processa dados JSON de medições
 *     tags: [ReceiverJson]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stationId:
 *                 type: string
 *                 description: ID da estação
 *               measures:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     parameterId:
 *                       type: string
 *                     value:
 *                       type: number
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       200:
 *         description: Dados processados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dados recebidos e processados com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Estação não encontrada
 */
receiverJsonRoutes.post(
  "/",
  limiter,
  ensureAuthenticated,
  asyncHandler(async (req, res, next) => {
    // Garantir que a conexão com MongoDB esteja estabelecida
    if (!receiverJsonController) {
      receiverJsonController = new ReceiverJsonController(
        receiverJsonUseCase, 
        receiverMongoJsonUseCase
      );
    }
    return receiverJsonController.handle(req, res, next);
  })
);

/**
 * @swagger
 * /receiverJson/sync:
 *   post:
 *     summary: Sincroniza dados com MongoDB
 *     tags: [ReceiverJson]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados sincronizados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dados sincronizados com sucesso
 *       400:
 *         description: Erro ao sincronizar dados
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Estação não encontrada
 */
receiverJsonRoutes.post(
  "/sync",
  limiter,
  ensureAuthenticated,
  asyncHandler(async (req, res, next) => {
    // Garantir que a conexão com MongoDB esteja estabelecida
    if (!receiverJsonController) {
      receiverJsonController = new ReceiverJsonController(
        receiverJsonUseCase, 
        receiverMongoJsonUseCase
      );
    }
    return receiverJsonController.sync(req, res, next);
  })
);

export { receiverJsonRoutes };
