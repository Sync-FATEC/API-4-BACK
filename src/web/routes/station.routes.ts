import { Router } from "express";
import CreateStationController from "../controllers/station/CreateStationController";
import { DeleteStationController } from "../controllers/station/DeleteStationController";
import { ListStationController } from "../controllers/station/ListStationController";
import { ReadStationController } from "../controllers/station/ReadStationController";
import { UpdateStationController } from "../controllers/station/UpdateStationController";
import { CreateStationUseCase } from "../../application/use-cases/station/CreateStationUseCase";
import DeleteStationUseCase from "../../application/use-cases/station/DeleteStationUseCase";
import { ListStationUseCase } from "../../application/use-cases/station/ListStationUseCase";
import { ReadStationUseCase } from "../../application/use-cases/station/ReadStationUseCase";
import UpdateStationUseCase from "../../application/use-cases/station/UpdateStationUseCase";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import { ensureAuthenticatedAdmin } from "../../infrastructure/middlewares/ensureAuthenticatedAdmin";
import { limiter } from "../../infrastructure/middlewares/limiter";
import StationRepository from "../../infrastructure/repositories/StationRepository";
import { asyncHandler } from "../middlewares/asyncHandler";
import { GenerateReportStationController } from "../controllers/station/GenerateReportStationController";

const stationRoutes = Router();
const stationRepository = new StationRepository();

// Create
const createStationUseCase = new CreateStationUseCase(stationRepository);
const createController = new CreateStationController(createStationUseCase);

// Update
const updateStationUseCase = new UpdateStationUseCase(stationRepository);
const updateController = new UpdateStationController(updateStationUseCase);

// Delete
const deleteStationUseCase = new DeleteStationUseCase(stationRepository);
const deleteController = new DeleteStationController(deleteStationUseCase);

// List
const listStationUseCase = new ListStationUseCase(stationRepository);
const listController = new ListStationController(listStationUseCase);

// Read
const readStationUseCase = new ReadStationUseCase(stationRepository);
const readController = new ReadStationController(readStationUseCase);

// Generate Pdf
const generateReportController = new GenerateReportStationController();

/**
 * @swagger
 * /generate-report:
 *   post:
 *     summary: Gera um relatório em PDF para uma estação
 *     tags: [Estações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - station_id
 *             properties:
 *               station_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: PDF gerado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
stationRoutes.post(
  "/generate-report",
  limiter,
  asyncHandler((req, res, next) =>
    generateReportController.handle(req, res, next)
  )
);

/**
 * @swagger
 * /station/create:
 *   post:
 *     summary: Cria uma nova estação
 *     tags: [Estações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Estação criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
stationRoutes.post(
  "/create",
  limiter,
  ensureAuthenticated,
  asyncHandler((req, res, next) => createController.handle(req, res, next))
);

/**
 * @swagger
 * /station/update:
 *   put:
 *     summary: Atualiza uma estação existente
 *     tags: [Estações]
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
 *               - name
 *               - location
 *               - description
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estação atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
stationRoutes.put(
  "/update",
  limiter,
  ensureAuthenticated,
  asyncHandler((req, res, next) => updateController.handle(req, res, next))
);

/**
 * @swagger
 * /station/delete/{id}:
 *   delete:
 *     summary: Remove uma estação
 *     tags: [Estações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da estação
 *     responses:
 *       200:
 *         description: Estação removida com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Estação não encontrada
 */
stationRoutes.delete(
  "/delete/:id",
  limiter,
  ensureAuthenticatedAdmin,
  asyncHandler((req, res, next) => deleteController.handle(req, res, next))
);

/**
 * @swagger
 * /station/list:
 *   get:
 *     summary: Lista todas as estações
 *     tags: [Estações]
 *     responses:
 *       200:
 *         description: Lista de estações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   location:
 *                     type: string
 *                   description:
 *                     type: string
 */
stationRoutes.get(
  "/list",
  limiter,
  asyncHandler((req, res, next) => listController.handle(req, res, next))
);

/**
 * @swagger
 * /station/read/{id}:
 *   get:
 *     summary: Obtém uma estação específica
 *     tags: [Estações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da estação
 *     responses:
 *       200:
 *         description: Estação retornada com sucesso
 *       404:
 *         description: Estação não encontrada
 */
stationRoutes.get(
  "/read/:id",
  limiter,
  asyncHandler((req, res, next) => readController.handle(req, res, next))
);

export { stationRoutes };
