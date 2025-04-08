import { Router } from 'express';
import { ListDashboardController } from '../controllers/Dashboard/ListDashboard';
import { ListDashboardUseCase } from '../../application/use-cases/dashboard/ListDashboardUseCase';
import { MeasureRepository } from '../../infrastructure/repositories/MeasureRepository';
import StationRepository from '../../infrastructure/repositories/StationRepository';
import { ParameterRepository } from '../../infrastructure/repositories/ParameterRepository';

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
dashboardRoutes.get('/', (req, res) => {
    return listDashboardController.handle(req, res);
});

// Additional dashboard routes can be added here

export { dashboardRoutes };
