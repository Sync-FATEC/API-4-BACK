import { Router } from 'express';
import { AuthUseCase } from '../../application/use-cases/auth/AuthUseCase';
import { RegisterUseCase } from '../../application/use-cases/auth/RegisterUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { AuthController } from '../controllers/auth/AuthController';
import { RegisterController } from '../controllers/auth/RegisterController';
import { UpdateUserUseCase } from '../../application/use-cases/auth/UpdateUserUseCase';
import { UpdateUserController } from '../controllers/auth/UpdateUserController';
import { DeleteUserUseCase } from '../../application/use-cases/auth/DeleteUserUseCase';
import { DeleteUserController } from '../controllers/auth/DeleteUserController';
import { ListUserUseCase } from '../../application/use-cases/auth/ListUserUseCase';
import { ListUserController } from '../controllers/auth/ListUserController';
import { ensureAuthenticated } from '../../infrastructure/middlewares/ensureAuthenticated';
import { ReadUserUseCase } from '../../application/use-cases/auth/ReadUserUseCase';
import ReadUserController from '../controllers/auth/ReadUserController';
import { limiter } from '../../infrastructure/middlewares/limiter';
import { ensureAuthenticatedAdmin } from '../../infrastructure/middlewares/ensureAuthenticatedAdmin';

const authRoutes = Router();
const userRepository = new UserRepository();

// Login
const authUseCase = new AuthUseCase(userRepository);
const authController = new AuthController(authUseCase);

// Registro
const registerUseCase = new RegisterUseCase(userRepository);
const registerController = new RegisterController(registerUseCase);

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

authRoutes.post('/login', limiter, (req, res) => authController.login(req, res));

authRoutes.post('/register', limiter, ensureAuthenticatedAdmin, (req, res) => registerController.handle(req, res));

authRoutes.put('/update', limiter, ensureAuthenticated, (req, res) => updateController.handle(req, res));

authRoutes.delete('/delete/:id', limiter, ensureAuthenticated, (req, res) => deleteController.handle(req, res));

authRoutes.get('/list', limiter, ensureAuthenticated, (req, res) => listController.handle(req, res));

authRoutes.get('/read/:id', limiter, ensureAuthenticated, (req, res) => readController.handle(req, res));

export { authRoutes }; 