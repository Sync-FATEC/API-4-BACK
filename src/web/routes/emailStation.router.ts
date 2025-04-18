import { Router } from "express";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { asyncHandler } from "../middlewares/asyncHandler";
import { EmailStationController } from "../controllers/emailStation/EmailStationController";
import { EmailStationRepository } from "../../infrastructure/repositories/EmailStationRepository";
import { RegisterEmailStationUseCase } from "../../application/use-cases/emailStation/RegisterEmailStationUseCase";
import StationRepository from "../../infrastructure/repositories/StationRepository";

// Repositories
const emailStationRepository = new EmailStationRepository();
const stationRepository = new StationRepository();

// Use Cases
const registerMeasureUseCase = new RegisterEmailStationUseCase(
  emailStationRepository,
  stationRepository
);

// Controller
const emailStationController = new EmailStationController(
  registerMeasureUseCase
);

const emailStationRoutes = Router();

// Routes
emailStationRoutes.post(
  "/create",
  limiter,
  asyncHandler((req, res, next) =>
    emailStationController.create(req, res, next)
  )
);

export { emailStationRoutes };
