import { Router } from 'express';
import { ListDashboardController } from '../controllers/Dashboard/ListDashboard';
import { ListDashboardUseCase } from '../../application/use-cases/dashboard/ListDashboardUseCase';
import { MeasureRepository } from '../../infrastructure/repositories/MeasureRepository';
import StationRepository from '../../infrastructure/repositories/StationRepository';
import { ParameterRepository } from '../../infrastructure/repositories/ParameterRepository';
import { asyncHandler } from '../middlewares/asyncHandler';
import { limiter } from "../../infrastructure/middlewares/limiter";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";

const dashboardRoutes = Router();

const listDashboardUseCase = new ListDashboardUseCase(
    new MeasureRepository(),
    new StationRepository(),
    new ParameterRepository()
);

const listDashboardController = new ListDashboardController(listDashboardUseCase);

dashboardRoutes.get('/:stationId/', limiter, ensureAuthenticated, asyncHandler((req, res, next) => {
    return listDashboardController.handle(req, res, next);
}));

dashboardRoutes.get('/public/:stationId', limiter, asyncHandler((req, res, next) => {
    return listDashboardController.handlePublic(req, res, next);
}));

export { dashboardRoutes };
