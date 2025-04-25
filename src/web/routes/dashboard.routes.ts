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

/**
 * @swagger
 * /dashboard/public:
 *   get:
 *     summary: Obtém dados públicos do dashboard (últimos 7 dias)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dados do dashboard retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       measures:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             parameterId:
 *                               type: string
 *                             value:
 *                               type: number
 *                             timestamp:
 *                               type: string
 *                               format: date-time
 */
dashboardRoutes.get('/public', limiter, asyncHandler((req, res, next) => {
    req.query.lastDays = '7';
    return listDashboardController.getAll(req, res, next);
}));

/**
 * @swagger
 * /dashboard/list:
 *   get:
 *     summary: Obtém dados do dashboard (requer autenticação)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lastDays
 *         schema:
 *           type: string
 *         description: Número de dias para buscar os dados
 *         example: 7
 *     responses:
 *       200:
 *         description: Dados do dashboard retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       measures:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             parameterId:
 *                               type: string
 *                             value:
 *                               type: number
 *                             timestamp:
 *                               type: string
 *                               format: date-time
 *       401:
 *         description: Não autorizado
 */
dashboardRoutes.get('/list', limiter, ensureAuthenticated, asyncHandler((req, res, next) => 
    listDashboardController.getAll(req, res, next)
));

export { dashboardRoutes };
