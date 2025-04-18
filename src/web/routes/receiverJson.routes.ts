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

receiverJsonRoutes.post(
  "/",
  limiter,
  ensureAuthenticated,
  asyncHandler((req, res, next) =>
    receiverJsonController.handle(req, res, next)
  )
);

export { receiverJsonRoutes };
