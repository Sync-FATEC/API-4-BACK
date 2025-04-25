import { Router } from "express";
import { TypeAlertController } from "../controllers/typeAlert/TypeAlertController";
import { ensureAuthenticatedAdmin } from "../../infrastructure/middlewares/ensureAuthenticatedAdmin";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { DeleteTypeAlertUseCase } from "../../application/use-cases/typeAlert/DeleteTypeAlertUseCase";
import { ListTypeAlertUseCase } from "../../application/use-cases/typeAlert/ListTypeAlertUseCase";
import { ReadTypeAlertUseCase } from "../../application/use-cases/typeAlert/ReadTypeAlertUseCase";
import { RegisterTypeAlertUseCase } from "../../application/use-cases/typeAlert/RegisterTypeAlertUseCase";
import { UpdateTypeAlertUseCase } from "../../application/use-cases/typeAlert/UpdateTypeAlertUseCase";
import { ParameterRepository } from "../../infrastructure/repositories/ParameterRepository";
import TypeAlertRepository from "../../infrastructure/repositories/TypeAlertRepository";
import { asyncHandler } from "../middlewares/asyncHandler";

const typeAlertRoutes = Router();

const parameterRepository = new ParameterRepository();
const typeAlertRepository = new TypeAlertRepository();

const registerTypeAlertUseCase = new RegisterTypeAlertUseCase(parameterRepository, typeAlertRepository);
const updateTypeAlertUseCase = new UpdateTypeAlertUseCase(parameterRepository, typeAlertRepository);
const listTypeAlertUseCase = new ListTypeAlertUseCase(typeAlertRepository);
const readTypeAlertUseCase = new ReadTypeAlertUseCase(typeAlertRepository);
const deleteTypeAlertUseCase = new DeleteTypeAlertUseCase(typeAlertRepository);

const typeAlertController = new TypeAlertController(
    registerTypeAlertUseCase,
    updateTypeAlertUseCase,
    listTypeAlertUseCase,
    readTypeAlertUseCase,
    deleteTypeAlertUseCase
);

/**
 * @swagger
 * /typeAlert:
 *   post:
 *     summary: Cria um novo tipo de alerta
 *     tags: [Tipos de Alerta]
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
 *               - parameters
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               parameters:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Tipo de alerta criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
typeAlertRoutes.post(
    "/",
    limiter,
    ensureAuthenticated,
    asyncHandler((req, res, next) => typeAlertController.create(req, res, next))
);

/**
 * @swagger
 * /typeAlert:
 *   put:
 *     summary: Atualiza um tipo de alerta existente
 *     tags: [Tipos de Alerta]
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
 *               - parameters
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               parameters:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Tipo de alerta atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
typeAlertRoutes.put(
    "/",
    limiter,
    ensureAuthenticated,
    asyncHandler((req, res, next) => typeAlertController.update(req, res, next))
);

/**
 * @swagger
 * /typeAlert:
 *   get:
 *     summary: Lista todos os tipos de alerta
 *     tags: [Tipos de Alerta]
 *     responses:
 *       200:
 *         description: Lista de tipos de alerta retornada com sucesso
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
 *                   parameters:
 *                     type: array
 *                     items:
 *                       type: string
 */
typeAlertRoutes.get(
    "/",
    limiter,
    asyncHandler((req, res, next) => typeAlertController.getAll(req, res, next))
);

/**
 * @swagger
 * /typeAlert/{id}:
 *   get:
 *     summary: Obtém um tipo de alerta específico
 *     tags: [Tipos de Alerta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do tipo de alerta
 *     responses:
 *       200:
 *         description: Tipo de alerta retornado com sucesso
 *       404:
 *         description: Tipo de alerta não encontrado
 */
typeAlertRoutes.get(
    "/:id",
    limiter,
    asyncHandler((req, res, next) => typeAlertController.getById(req, res, next))
);

/**
 * @swagger
 * /typeAlert/{id}:
 *   delete:
 *     summary: Remove um tipo de alerta
 *     tags: [Tipos de Alerta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do tipo de alerta
 *     responses:
 *       200:
 *         description: Tipo de alerta removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Tipo de alerta não encontrado
 */
typeAlertRoutes.delete(
    "/:id",
    limiter,
    ensureAuthenticatedAdmin,
    asyncHandler((req, res, next) => typeAlertController.delete(req, res, next))
);

export { typeAlertRoutes };