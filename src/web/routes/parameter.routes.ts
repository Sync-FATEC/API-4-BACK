import { Router } from "express";
import CreateParameterController from "../controllers/parameter/CreateParameterController";
import { CreateParameterUseCase } from "../../application/use-cases/parameter/CreateParameterUseCase";
import { ParameterRepository } from "../../infrastructure/repositories/ParameterRepository";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import { ListParameterUseCase } from "../../application/use-cases/parameter/ListParameterUseCase";
import { ListParameterController } from "../controllers/parameter/ListParameterController";
import UpdateParameterUseCase from "../../application/use-cases/parameter/UpdateParameterUseCase";
import { UpdateParameterController } from "../controllers/parameter/UpdateParameterController";
import DeleteParameterUseCase from "../../application/use-cases/parameter/DeleteParameterUseCase";
import { DeleteParameterController } from "../controllers/parameter/DeleteParameterController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ensureAuthenticatedAdmin } from "../../infrastructure/middlewares/ensureAuthenticatedAdmin";

const parameterRoutes = Router();
const parameterRepository = new ParameterRepository();

// Create
const createParameterUseCase = new CreateParameterUseCase(parameterRepository);
const createController = new CreateParameterController(createParameterUseCase);


// List
const listParameterUseCase = new ListParameterUseCase(parameterRepository);
const listController = new ListParameterController(listParameterUseCase);

// Update
const updateParameterUseCase = new UpdateParameterUseCase(parameterRepository);
const updateController = new UpdateParameterController(updateParameterUseCase);

// Delete
const deleteParameterUseCase = new DeleteParameterUseCase(parameterRepository);
const deleteController = new DeleteParameterController(deleteParameterUseCase);

/**
 * @swagger
 * /parameter/create:
 *   post:
 *     summary: Cria um novo parâmetro
 *     tags: [Parâmetros]
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
 *               - unit
 *               - typeParameterId
 *             properties:
 *               name:
 *                 type: string
 *               unit:
 *                 type: string
 *               typeParameterId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Parâmetro criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
parameterRoutes.post('/create', limiter, ensureAuthenticated, asyncHandler((req, res, next) => createController.handle(req, res, next)));

/**
 * @swagger
 * /parameter/list:
 *   get:
 *     summary: Lista todos os parâmetros
 *     tags: [Parâmetros]
 *     responses:
 *       200:
 *         description: Lista de parâmetros retornada com sucesso
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
 *                   unit:
 *                     type: string
 *                   typeParameterId:
 *                     type: string
 */
parameterRoutes.get('/list', limiter, asyncHandler((req, res, next) => listController.handle(req, res, next)));

/**
 * @swagger
 * /parameter/update:
 *   put:
 *     summary: Atualiza um parâmetro existente
 *     tags: [Parâmetros]
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
 *               - unit
 *               - typeParameterId
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               unit:
 *                 type: string
 *               typeParameterId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Parâmetro atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
parameterRoutes.put('/update', limiter, ensureAuthenticated, asyncHandler((req, res, next) => updateController.handle(req, res, next)));

/**
 * @swagger
 * /parameter/delete/{id}:
 *   delete:
 *     summary: Remove um parâmetro
 *     tags: [Parâmetros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do parâmetro
 *     responses:
 *       200:
 *         description: Parâmetro removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Parâmetro não encontrado
 */
parameterRoutes.delete('/delete/:id', limiter, ensureAuthenticatedAdmin, asyncHandler((req, res, next) => deleteController.handle(req, res, next)));

export { parameterRoutes }