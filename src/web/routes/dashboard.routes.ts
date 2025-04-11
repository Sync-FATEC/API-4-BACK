import { Router } from 'express';
import { ListDashboardController } from '../controllers/Dashboard/ListDashboard';
import { ListDashboardUseCase } from '../../application/use-cases/dashboard/ListDashboardUseCase';
import { MeasureRepository } from '../../infrastructure/repositories/MeasureRepository';
import StationRepository from '../../infrastructure/repositories/StationRepository';
import { ParameterRepository } from '../../infrastructure/repositories/ParameterRepository';
import { asyncHandler } from '../middlewares/asyncHandler';
import { limiter } from "../../infrastructure/middlewares/limiter";

const dashboardRoutes = Router();

// Initialize use case
const listDashboardUseCase = new ListDashboardUseCase(
    new MeasureRepository(),
    new StationRepository(),
    new ParameterRepository()
);

// Initialize controller
const listDashboardController = new ListDashboardController(listDashboardUseCase);

// Define routes
dashboardRoutes.get('/list', limiter, asyncHandler((req, res, next) => listDashboardController.getAll(req, res, next)));

// Additional dashboard routes can be added here

export { dashboardRoutes };
