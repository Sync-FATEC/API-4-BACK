import { Router } from "express";
import ReceiverJsonUseCase from "../../application/use-cases/receiverJson/receiverJsonUseCase";
import { AlertRepository } from "../../infrastructure/repositories/AlertRepository";
import { MeasureRepository } from "../../infrastructure/repositories/MeasureRepository";
import StationRepository from "../../infrastructure/repositories/StationRepository";
import TypeAlertRepository from "../../infrastructure/repositories/TypeAlertRepository";
import { ReceiverJsonController } from "../controllers/receiverJsonController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ParameterRepository } from "../../infrastructure/repositories/ParameterRepository";

const measureRepository = new MeasureRepository();
const stationRepository = new StationRepository();
const alertRepository = new AlertRepository();
const typeAlertRepository = new TypeAlertRepository();
const parameterRepository = new ParameterRepository();

const receiverJsonUseCase = new ReceiverJsonUseCase(
    stationRepository,
    alertRepository,
    typeAlertRepository,
    measureRepository,
    parameterRepository
)

const receiverJsonController = new ReceiverJsonController(receiverJsonUseCase);

const receiverJsonRoutes = Router();

receiverJsonRoutes.post('/', asyncHandler((req, res, next) => receiverJsonController.handle(req, res, next)));

export { receiverJsonRoutes };