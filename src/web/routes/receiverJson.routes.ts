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

const measureRepository = new MeasureRepository();
const stationRepository = new StationRepository();
const alertRepository = new AlertRepository();
const typeAlertRepository = new TypeAlertRepository();
const parameterRepository = new ParameterRepository();
const notificationService = getNotificationService();
const emailStationRepository = new EmailStationRepository();
const senderAlert = new SenderAlertService(
  notificationService,
  emailSender,
  emailStationRepository
);

const receiverJsonUseCase = new ReceiverJsonUseCase(
  stationRepository,
  alertRepository,
  typeAlertRepository,
  measureRepository,
  parameterRepository,
  senderAlert
);

const receiverJsonController = new ReceiverJsonController(receiverJsonUseCase);

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
  asyncHandler((req, res, next) =>
    receiverJsonController.handle(req, res, next)
  )
);

export { receiverJsonRoutes };
