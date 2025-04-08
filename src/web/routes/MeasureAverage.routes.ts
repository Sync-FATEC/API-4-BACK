import { Router } from "express";
import ListMeasureAverageUseCase from "../../application/use-cases/measureAverage/ListMeasureAverageUseCase";
import { MeasureAverageRepository } from "../../infrastructure/repositories/MeasureAverageRepository";
import { ListMeasureAverageController } from "../controllers/MeasureAverage/ListMeasureAverageController";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { asyncHandler } from "../middlewares/asyncHandler";

// Repositories
const measureAverageRepository = new MeasureAverageRepository();

// UseCases
const listMeasureAverageUseCase = new ListMeasureAverageUseCase(measureAverageRepository);

// Controllers
const listMeasureAverageController = new ListMeasureAverageController(listMeasureAverageUseCase);

const measureAverageRoutes = Router();

measureAverageRoutes.get("/:stationId", limiter, asyncHandler((req, res, next) => listMeasureAverageController.handle(req, res, next)));

export default measureAverageRoutes;