import { Router } from 'express';
import { AuthUseCase } from '../../application/use-cases/auth/AuthUseCase';
import { RegisterUseCase } from '../../application/use-cases/auth/RegisterUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { AuthController } from '../controllers/auth/AuthController';
import { RegisterController } from '../controllers/auth/RegisterController';
import { UpdateUserUseCase } from '../../application/use-cases/user/UpdateUserUseCase';
import { UpdateUserController } from '../controllers/user/UpdateUserController';
import { DeleteUserController } from '../controllers/user/DeleteUserController';
import { ListUserUseCase } from '../../application/use-cases/user/ListUserUseCase';
import { ListUserController } from '../controllers/user/ListUserController';
import { ensureAuthenticated } from '../../infrastructure/middlewares/ensureAuthenticated';
import { ReadUserUseCase } from '../../application/use-cases/user/ReadUserUseCase';
import ReadUserController from '../controllers/user/ReadUserController';
import { limiter } from '../../infrastructure/middlewares/limiter';
import { ensureAuthenticatedAdmin } from '../../infrastructure/middlewares/ensureAuthenticatedAdmin';
import { EmailUseCase } from '../../application/use-cases/email/EmailUseCase';
import { NodemailerEmailSender } from '../../infrastructure/email/nodeMailerEmailSender';
import { DeleteUserUseCase } from '../../application/use-cases/user/DeleteUserUseCase';
import CreatePasswordUseCase from '../../application/use-cases/auth/CreatePasswordUseCase';
import CreatePasswordController from '../controllers/auth/CreatePasswordController';

const authRoutes = Router();
const userRepository = new UserRepository();

// Login
const authUseCase = new AuthUseCase(userRepository);
const authController = new AuthController(authUseCase);

// Email
const emailSender = NodemailerEmailSender.getInstance();
const emailUseCase = new EmailUseCase(emailSender);

// Registro
const registerUseCase = new RegisterUseCase(userRepository, emailUseCase);
const registerController = new RegisterController(registerUseCase);

// CreatePassword
const createPasswordUseCase = new CreatePasswordUseCase(userRepository);
const createPasswordController = new CreatePasswordController(createPasswordUseCase)

authRoutes.post('/login', limiter, (req, res) => authController.login(req, res));

authRoutes.post('/register', limiter, ensureAuthenticatedAdmin, (req, res) => registerController.handle(req, res));

authRoutes.post('/createpassword', limiter, (req, res) => createPasswordController.handle(req, res))

export { authRoutes }; 