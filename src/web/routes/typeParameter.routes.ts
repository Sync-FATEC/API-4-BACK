import { Router } from "express";
import CreateTypeParametersController from "../controllers/typeParameter/CreateTypeParameterController";
import TypeParemeterRepository from "../../infrastructure/repositories/TypeParameterRepository";
import { CreateTypeParameterUseCase } from "../../application/use-cases/typeParameter/CreateTypeParameterUseCase";
import UpdateTypeParameterUseCase from "../../application/use-cases/typeParameter/UpdateTypeParameterUseCase";
import { UpdateTypeParameterController } from "../controllers/typeParameter/UpdateTypeParameterController";
import DeleteTypeParameterUseCase from "../../application/use-cases/typeParameter/DeleteTypeParameterUsecase";
import { DeleteTypeParameterController } from "../controllers/typeParameter/DeleteTypeParameterController";
import { ReadTypeParameterUseCase } from "../../application/use-cases/typeParameter/ReadTypeParameterUseCase";
import { ReadTypeParameterController } from "../controllers/typeParameter/ReadTypeParameterController";
import { ListTypeParameterUseCase } from "../../application/use-cases/typeParameter/ListTypeParameterUsecase";
import { ListTypeParameterController } from "../controllers/typeParameter/ListTypeParameterController";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ensureAuthenticatedAdmin } from "../../infrastructure/middlewares/ensureAuthenticatedAdmin";

const typeParameterRoutes = Router();
const typeParametersRepository = new TypeParemeterRepository();

// Create
const createTypeParameterUseCase = new CreateTypeParameterUseCase(typeParametersRepository);
const createController = new CreateTypeParametersController(createTypeParameterUseCase);

// Update
const updateTypeParameterUseCase = new UpdateTypeParameterUseCase(typeParametersRepository);
const updateController = new UpdateTypeParameterController(updateTypeParameterUseCase);

// Delete
const deleteTypeParameterUseCase = new DeleteTypeParameterUseCase(typeParametersRepository);
const deleteController = new DeleteTypeParameterController(deleteTypeParameterUseCase);

// Read
const readTypeParameterUseCase = new ReadTypeParameterUseCase(typeParametersRepository);
const readController = new ReadTypeParameterController(readTypeParameterUseCase);

// List
const listTypeParameterUseCase = new ListTypeParameterUseCase(typeParametersRepository);
const listController = new ListTypeParameterController(listTypeParameterUseCase);

/**
 * @swagger
 * /typeParameter/create:
 *   post:
 *     summary: Cria um novo tipo de parâmetro
 *     tags: [Tipos de Parâmetro]
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
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tipo de parâmetro criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
typeParameterRoutes.post('/create', limiter, ensureAuthenticated, asyncHandler((req, res, next) => createController.handle(req, res, next)));

/**
 * @swagger
 * /typeParameter/update:
 *   put:
 *     summary: Atualiza um tipo de parâmetro existente
 *     tags: [Tipos de Parâmetro]
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
 *               - description
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tipo de parâmetro atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
typeParameterRoutes.put('/update', limiter, ensureAuthenticated, asyncHandler((req, res, next) => updateController.handle(req, res, next)));

/**
 * @swagger
 * /typeParameter/delete/{id}:
 *   delete:
 *     summary: Remove um tipo de parâmetro
 *     tags: [Tipos de Parâmetro]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do tipo de parâmetro
 *     responses:
 *       200:
 *         description: Tipo de parâmetro removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Tipo de parâmetro não encontrado
 */
typeParameterRoutes.delete('/delete/:id', limiter, ensureAuthenticatedAdmin, asyncHandler((req, res, next) => deleteController.handle(req, res, next)));

/**
 * @swagger
 * /typeParameter/read/{id}:
 *   get:
 *     summary: Obtém um tipo de parâmetro específico
 *     tags: [Tipos de Parâmetro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do tipo de parâmetro
 *     responses:
 *       200:
 *         description: Tipo de parâmetro retornado com sucesso
 *       404:
 *         description: Tipo de parâmetro não encontrado
 */
typeParameterRoutes.get('/read/:id', limiter, asyncHandler((req, res, next) => readController.handle(req, res, next)));

/**
 * @swagger
 * /typeParameter/list:
 *   get:
 *     summary: Lista todos os tipos de parâmetro
 *     tags: [Tipos de Parâmetro]
 *     responses:
 *       200:
 *         description: Lista de tipos de parâmetro retornada com sucesso
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
 *                   description:
 *                     type: string
 */
typeParameterRoutes.get('/list', limiter, asyncHandler((req, res, next) => listController.handle(req, res, next)));

export { typeParameterRoutes }