import { Router } from "express";
import ListMeasureAverageUseCase from "../../application/use-cases/measureAverage/ListMeasureAverageUseCase";
import { MeasureAverageRepository } from "../../infrastructure/repositories/MeasureAverageRepository";
import { ListMeasureAverageController } from "../controllers/MeasureAverage/ListMeasureAverageController";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { asyncHandler } from "../middlewares/asyncHandler";
import StationRepository from "../../infrastructure/repositories/StationRepository";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";

// Repositories
const measureAverageRepository = new MeasureAverageRepository();
const stationRepository = new StationRepository();

// UseCases
const listMeasureAverageUseCase = new ListMeasureAverageUseCase(measureAverageRepository, stationRepository);

// Controllers
const listMeasureAverageController = new ListMeasureAverageController(listMeasureAverageUseCase);

const measureAverageRoutes = Router();

/**
 * @swagger
 * /measureAverage/{stationId}:
 *   get:
 *     summary: Obtém a média das medições de uma estação
 *     tags: [Médias de Medição]
 *     parameters:
 *       - in: path
 *         name: stationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da estação
 *     responses:
 *       200:
 *         description: Médias de medição retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   parameterId:
 *                     type: string
 *                   average:
 *                     type: number
 *                   stationId:
 *                     type: string
 *       404:
 *         description: Estação não encontrada
 */
measureAverageRoutes.get("/:stationId", limiter, asyncHandler((req, res, next) => listMeasureAverageController.handle(req, res, next)));
measureAverageRoutes.get("/public/:stationId", limiter, asyncHandler((req, res, next) => listMeasureAverageController.handle(req, res, next)));
measureAverageRoutes.get("/:stationId/:start/:end", limiter, ensureAuthenticated, asyncHandler((req, res, next) => listMeasureAverageController.handleWithStartAndEnd(req, res, next)));
measureAverageRoutes.get("/:stationId/:date", limiter, ensureAuthenticated, asyncHandler((req, res, next) => listMeasureAverageController.handleWithDate(req, res, next)));

export default measureAverageRoutes;