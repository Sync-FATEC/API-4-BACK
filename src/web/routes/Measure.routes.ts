import { Router } from "express";
import { MeasureRepository } from "../../infrastructure/repositories/MeasureRepository";
import { RegisterMeasureUseCase } from "../../application/use-cases/measure/RegisterMeasureUseCase";
import { UpdateMeasureUseCase } from "../../application/use-cases/measure/UpdateMeasureUseCase";
import { ListMeasureUseCase } from "../../application/use-cases/measure/ListMeasureUseCase";
import { ReadMeasureUseCase } from "../../application/use-cases/measure/ReadMeasureUseCase";
import { DeleteMeasureUseCase } from "../../application/use-cases/measure/DeleteMeasureUseCase";
import { MeasureController } from "../controllers/Measure/MeasureController";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import { ensureAuthenticatedAdmin } from "../../infrastructure/middlewares/ensureAuthenticatedAdmin";
import { ParameterRepository } from "../../infrastructure/repositories/ParameterRepository";
import { asyncHandler } from "../middlewares/asyncHandler";
import StationRepository from "../../infrastructure/repositories/StationRepository";

// Repositories
const measureRepository = new MeasureRepository();
const parameterRepository = new ParameterRepository();
const stationRepository = new StationRepository();

// Use Cases
const registerMeasureUseCase = new RegisterMeasureUseCase(measureRepository, parameterRepository, stationRepository);
const updateMeasureUseCase = new UpdateMeasureUseCase(measureRepository);
const listMeasureUseCase = new ListMeasureUseCase(measureRepository);
const readMeasureUseCase = new ReadMeasureUseCase(measureRepository);
const deleteMeasureUseCase = new DeleteMeasureUseCase(measureRepository);

// Controller
const measureController = new MeasureController(
  registerMeasureUseCase,
  updateMeasureUseCase,
  listMeasureUseCase,
  readMeasureUseCase,
  deleteMeasureUseCase
);

const measureRoutes = Router();

/**
 * @swagger
 * /measure/create:
 *   post:
 *     summary: Cria uma nova medida
 *     tags: [Medidas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *               - parameterId
 *               - stationId
 *             properties:
 *               value:
 *                 type: number
 *               parameterId:
 *                 type: string
 *               stationId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Medida criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
measureRoutes.post('/create', limiter, ensureAuthenticatedAdmin, asyncHandler((req, res, next) => measureController.create(req, res, next)));

/**
 * @swagger
 * /measure/update:
 *   put:
 *     summary: Atualiza uma medida existente
 *     tags: [Medidas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - value
 *               - parameterId
 *               - stationId
 *             properties:
 *               id:
 *                 type: string
 *               value:
 *                 type: number
 *               parameterId:
 *                 type: string
 *               stationId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medida atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
measureRoutes.put('/update', limiter, ensureAuthenticatedAdmin, asyncHandler((req, res, next) => measureController.update(req, res, next)));

/**
 * @swagger
 * /measure/list:
 *   get:
 *     summary: Lista todas as medidas
 *     tags: [Medidas]
 *     responses:
 *       200:
 *         description: Lista de medidas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   value:
 *                     type: number
 *                   parameterId:
 *                     type: string
 *                   stationId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
measureRoutes.get('/list', limiter, asyncHandler((req, res, next) => measureController.getAll(req, res, next)));

/**
 * @swagger
 * /measure/read/{id}:
 *   get:
 *     summary: Obtém uma medida específica
 *     tags: [Medidas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da medida
 *     responses:
 *       200:
 *         description: Medida retornada com sucesso
 *       404:
 *         description: Medida não encontrada
 */
measureRoutes.get('/read/:id', limiter, asyncHandler((req, res, next) => measureController.getById(req, res, next)));

/**
 * @swagger
 * /measure/delete/{id}:
 *   delete:
 *     summary: Remove uma medida
 *     tags: [Medidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da medida
 *     responses:
 *       200:
 *         description: Medida removida com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Medida não encontrada
 */
measureRoutes.delete('/delete/:id', limiter, ensureAuthenticatedAdmin, asyncHandler((req, res, next) => measureController.delete(req, res, next)));

export { measureRoutes };
