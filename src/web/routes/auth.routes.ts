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

authRoutes.post('/login', limiter, (req, res) => authController.login(req, res));

authRoutes.post('/register', limiter, ensureAuthenticatedAdmin, (req, res) => registerController.handle(req, res));

authRoutes.post('/createpassword', limiter, (req, res) => createPasswordController.handle(req, res))

export { authRoutes }; 