import { Router } from 'express';
import { AuthUseCase } from '../../application/use-cases/auth/AuthUseCase';
import { RegisterUseCase } from '../../application/use-cases/auth/RegisterUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { AuthController } from '../controllers/auth/AuthController';
import { RegisterController } from '../controllers/auth/RegisterController';
import { limiter } from '../../infrastructure/middlewares/limiter';
import { ensureAuthenticatedAdmin } from '../../infrastructure/middlewares/ensureAuthenticatedAdmin';

import CreatePasswordUseCase from '../../application/use-cases/auth/CreatePasswordUseCase';
import CreatePasswordController from '../controllers/auth/CreatePasswordController';
import { asyncHandler } from '../middlewares/asyncHandler';

const authRoutes = Router();
const userRepository = new UserRepository();

// Login
const authUseCase = new AuthUseCase(userRepository);
const authController = new AuthController(authUseCase);

// Registro
const registerUseCase = new RegisterUseCase(userRepository);
const registerController = new RegisterController(registerUseCase);

// CreatePassword
const createPasswordUseCase = new CreatePasswordUseCase(userRepository);
const createPasswordController = new CreatePasswordController(createPasswordUseCase)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
authRoutes.post('/login', limiter, asyncHandler((req, res, next) => authController.login(req, res, next)));

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
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
 *               - email
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       401:
 *         description: Não autorizado
 */
authRoutes.post('/register', limiter, ensureAuthenticatedAdmin, asyncHandler((req, res, next) => registerController.handle(req, res, next)));

/**
 * @swagger
 * /auth/createpassword:
 *   post:
 *     summary: Cria uma nova senha para o usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
authRoutes.post('/createpassword', limiter, asyncHandler((req, res, next) => createPasswordController.handle(req, res, next)));

export { authRoutes }; 