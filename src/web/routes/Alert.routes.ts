import { Router } from "express";
import { AlertRepository } from "../../infrastructure/repositories/AlertRepository";
import { DeleteAlertUseCase } from "../../application/use-cases/alert/DeleteAlertUseCase";
import { ListAlertUseCase } from "../../application/use-cases/alert/ListAlertUseCase";
import { ReadAlertUseCase } from "../../application/use-cases/alert/ReadAlertUseCase";
import RegisterAlertUseCase from "../../application/use-cases/alert/RegisterAlertUseCase";
import { UpdateAlertUseCase } from "../../application/use-cases/alert/UpdateAlertUseCase";
import { AlertController } from "../controllers/Alert/AlertController";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import { ensureAuthenticatedAdmin } from "../../infrastructure/middlewares/ensureAuthenticatedAdmin";
import { MeasureRepository } from "../../infrastructure/repositories/MeasureRepository";
import TypeAlertRepository from "../../infrastructure/repositories/TypeAlertRepository";
import { asyncHandler } from "../middlewares/asyncHandler";
import { SenderAlertService } from "../../application/services/SenderAlertService";
import { NodemailerEmailSender } from "../../infrastructure/email/nodeMailerEmailSender";
import { EmailStationRepository } from "../../infrastructure/repositories/EmailStationRepository";
import { getNotificationService } from "../../infrastructure/websocket/socket";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
// Repositories
const alertRepository = new AlertRepository();
const typeAlertRepository = new TypeAlertRepository();
const measureRepository = new MeasureRepository();
const userRepository = new UserRepository();

// Notification Service
const notificationService = getNotificationService();
const emailSender = NodemailerEmailSender.getInstance();
const emailStationRepository = new EmailStationRepository();

// Services
const senderAlert = new SenderAlertService(
  notificationService,
  emailSender,
  emailStationRepository,
  userRepository
);

// Use Cases
const registerAlertUseCase = new RegisterAlertUseCase(
  alertRepository,
  typeAlertRepository,
  measureRepository,
  senderAlert
);
const updateAlertUseCase = new UpdateAlertUseCase(
  alertRepository,
  typeAlertRepository,
  measureRepository
);
const listAlertUseCase = new ListAlertUseCase(alertRepository);
const readAlertUseCase = new ReadAlertUseCase(alertRepository);
const deleteAlertUseCase = new DeleteAlertUseCase(alertRepository);

// Controller
const alertController = new AlertController(
  registerAlertUseCase,
  updateAlertUseCase,
  listAlertUseCase,
  readAlertUseCase,
  deleteAlertUseCase
);

const alertRoutes = Router();

/**
 * @swagger
 * /alert/create:
 *   post:
 *     summary: Cria um novo alerta
 *     tags: [Alertas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - typeAlertId
 *               - stationId
 *               - parameterId
 *               - condition
 *               - value
 *             properties:
 *               typeAlertId:
 *                 type: string
 *               stationId:
 *                 type: string
 *               parameterId:
 *                 type: string
 *               condition:
 *                 type: string
 *                 enum: [greater, less, equal]
 *               value:
 *                 type: number
 *     responses:
 *       201:
 *         description: Alerta criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
alertRoutes.post(
  "/create",
  limiter,
  ensureAuthenticated,
  asyncHandler((req, res, next) => alertController.create(req, res, next))
);

/**
 * @swagger
 * /alert/update:
 *   put:
 *     summary: Atualiza um alerta existente
 *     tags: [Alertas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - typeAlertId
 *               - stationId
 *               - parameterId
 *               - condition
 *               - value
 *             properties:
 *               id:
 *                 type: string
 *               typeAlertId:
 *                 type: string
 *               stationId:
 *                 type: string
 *               parameterId:
 *                 type: string
 *               condition:
 *                 type: string
 *                 enum: [greater, less, equal]
 *               value:
 *                 type: number
 *     responses:
 *       200:
 *         description: Alerta atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
alertRoutes.put(
  "/update",
  limiter,
  ensureAuthenticated,
  asyncHandler((req, res, next) => alertController.update(req, res, next))
);

/**
 * @swagger
 * /alert/list:
 *   get:
 *     summary: Lista todos os alertas
 *     tags: [Alertas]
 *     responses:
 *       200:
 *         description: Lista de alertas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   typeAlertId:
 *                     type: string
 *                   stationId:
 *                     type: string
 *                   parameterId:
 *                     type: string
 *                   condition:
 *                     type: string
 *                   value:
 *                     type: number
 */
alertRoutes.get(
  "/list",
  limiter,
  asyncHandler((req, res, next) => alertController.getAll(req, res, next))
);

/**
 * @swagger
 * /alert/read/{id}:
 *   get:
 *     summary: Obtém um alerta específico
 *     tags: [Alertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do alerta
 *     responses:
 *       200:
 *         description: Alerta retornado com sucesso
 *       404:
 *         description: Alerta não encontrado
 */
alertRoutes.get(
  "/read/:id",
  limiter,
  asyncHandler((req, res, next) => alertController.getById(req, res, next))
);

/**
 * @swagger
 * /alert/delete/{id}:
 *   delete:
 *     summary: Remove um alerta
 *     tags: [Alertas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do alerta
 *     responses:
 *       200:
 *         description: Alerta removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Alerta não encontrado
 */
alertRoutes.delete(
  "/delete/:id",
  limiter,
  ensureAuthenticatedAdmin,
  asyncHandler((req, res, next) => alertController.delete(req, res, next))
);

export { alertRoutes };
