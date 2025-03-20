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

userRoutes.put('/update', limiter, ensureAuthenticated, (req, res) => updateController.handle(req, res));

userRoutes.delete('/delete/:id', limiter, ensureAuthenticatedAdmin, (req, res) => deleteController.handle(req, res));

userRoutes.get('/list', limiter, ensureAuthenticatedAdmin, (req, res) => listController.handle(req, res));

userRoutes.get('/read/:id', limiter, ensureAuthenticated, (req, res) => readController.handle(req, res));

userRoutes.put('/change-password', limiter, ensureAuthenticated, (req, res) => changePasswordController.handle(req, res));

export { userRoutes }