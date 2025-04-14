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

// Initialize use case
const listDashboardUseCase = new ListDashboardUseCase(
    new MeasureRepository(),
    new StationRepository(),
    new ParameterRepository()
);

// Initialize controller
const listDashboardController = new ListDashboardController(listDashboardUseCase);

// Rota pública - limitada aos últimos 7 dias para usuários não autenticados
dashboardRoutes.get('/public', limiter, asyncHandler((req, res, next) => {
    // Força a configuração para os últimos 7 dias
    req.query.lastDays = '7';
    return listDashboardController.getAll(req, res, next);
}));

// Rota protegida - permite todos os filtros para usuários autenticados
dashboardRoutes.get('/list', limiter, ensureAuthenticated, asyncHandler((req, res, next) => 
    listDashboardController.getAll(req, res, next)
));

export { dashboardRoutes };
