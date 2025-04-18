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
import { NotificationService } from "../../infrastructure/websocket/service/NotificationService";
import { NodemailerEmailSender } from "../../infrastructure/email/nodeMailerEmailSender";
import { EmailStationRepository } from "../../infrastructure/repositories/EmailStationRepository";
import { getNotificationService } from "../../infrastructure/websocket/socket";

// Repositories
const alertRepository = new AlertRepository();
const typeAlertRepository = new TypeAlertRepository(); // Definido antes de ser utilizado
const measureRepository = new MeasureRepository();

// Notification Service
const notificationService = getNotificationService();
const emailSender = NodemailerEmailSender.getInstance();
const emailStationRepository = new EmailStationRepository();

// Services
const senderAlert = new SenderAlertService(
  notificationService,
  emailSender,
  emailStationRepository
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

// Routes
alertRoutes.post(
  "/create",
  limiter,
  ensureAuthenticated,
  asyncHandler((req, res, next) => alertController.create(req, res, next))
);
alertRoutes.put(
  "/update",
  limiter,
  ensureAuthenticated,
  asyncHandler((req, res, next) => alertController.update(req, res, next))
);
alertRoutes.get(
  "/list",
  limiter,
  asyncHandler((req, res, next) => alertController.getAll(req, res, next))
);
alertRoutes.get(
  "/read/:id",
  limiter,
  asyncHandler((req, res, next) => alertController.getById(req, res, next))
);
alertRoutes.delete(
  "/delete/:id",
  limiter,
  ensureAuthenticatedAdmin,
  asyncHandler((req, res, next) => alertController.delete(req, res, next))
);

export { alertRoutes };
