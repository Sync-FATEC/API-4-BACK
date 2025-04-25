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

/**
 * @swagger
 * /emailStation/create:
 *   post:
 *     summary: Registra um email para uma estação
 *     tags: [Emails de Estação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - stationId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               stationId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Email registrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Estação não encontrada
 */
emailStationRoutes.post(
  "/create",
  limiter,
  asyncHandler((req, res, next) =>
    emailStationController.create(req, res, next)
  )
);

export { emailStationRoutes };
