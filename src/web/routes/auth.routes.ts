import { Router } from 'express';
import { AuthUseCase } from '../../application/use-cases/auth/AuthUseCase';
import { RegisterUseCase } from '../../application/use-cases/auth/RegisterUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { AuthController } from '../controllers/auth/AuthController';
import { RegisterController } from '../controllers/auth/RegisterController';

const authRoutes = Router();
const userRepository = new UserRepository();

// Login
const authUseCase = new AuthUseCase(userRepository);
const authController = new AuthController(authUseCase);

// Registro
const registerUseCase = new RegisterUseCase(userRepository);
const registerController = new RegisterController(registerUseCase);


authRoutes.post('/login', (req, res) => authController.login(req, res));
authRoutes.post('/register', (req, res) => registerController.handle(req, res));

export { authRoutes }; 