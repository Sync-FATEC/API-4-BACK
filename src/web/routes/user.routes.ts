import { Router } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { DeleteUserUseCase } from "../../application/use-cases/user/DeleteUserUseCase";
import { ListUserUseCase } from "../../application/use-cases/user/ListUserUseCase";
import { ReadUserUseCase } from "../../application/use-cases/user/ReadUserUseCase";
import { UpdateUserUseCase } from "../../application/use-cases/user/UpdateUserUseCase";
import { DeleteUserController } from "../controllers/user/DeleteUserController";
import { ListUserController } from "../controllers/user/ListUserController";
import ReadUserController from "../controllers/user/ReadUserController";
import { UpdateUserController } from "../controllers/user/UpdateUserController";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import { ensureAuthenticatedAdmin } from "../../infrastructure/middlewares/ensureAuthenticatedAdmin";
import ChangePasswordUseCase from "../../application/use-cases/user/ChangePasswordUseCase";
import { ChangePasswordController } from "../controllers/user/ChangePasswordController";
import { asyncHandler } from "../middlewares/asyncHandler";

const userRoutes = Router();
const userRepository = new UserRepository()

// Update
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const updateController = new UpdateUserController(updateUserUseCase);


// Delete 
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const deleteController = new DeleteUserController(deleteUserUseCase);

// List
const listUserUseCase = new ListUserUseCase(userRepository);
const listController = new ListUserController(listUserUseCase);

// Read
const readUserUseCase = new ReadUserUseCase(userRepository);
const readController = new ReadUserController(readUserUseCase);

// Change Password
const changePasswordUseCase = new ChangePasswordUseCase(userRepository);
const changePasswordController = new ChangePasswordController(changePasswordUseCase);

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Usuários]
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
 *               - email
 *               - role
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
userRoutes.put('/update', limiter, ensureAuthenticatedAdmin, asyncHandler((req, res, next) => updateController.handle(req, res, next)));

/**
 * @swagger
 * /user/delete/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.delete('/delete/:id', limiter, ensureAuthenticatedAdmin, asyncHandler((req, res, next) => deleteController.handle(req, res, next)));

/**
 * @swagger
 * /user/list:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
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
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 */
userRoutes.get('/list', limiter, ensureAuthenticatedAdmin, asyncHandler((req, res, next) => listController.handle(req, res, next)));

/**
 * @swagger
 * /user/read/{id}:
 *   get:
 *     summary: Obtém um usuário específico
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário retornado com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.get('/read/:id', limiter, ensureAuthenticated, asyncHandler((req, res, next) => readController.handle(req, res, next)));

/**
 * @swagger
 * /user/change-password:
 *   put:
 *     summary: Altera a senha do usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
userRoutes.put('/change-password', limiter, ensureAuthenticated, asyncHandler((req, res, next) => changePasswordController.handle(req, res, next)));

export { userRoutes }