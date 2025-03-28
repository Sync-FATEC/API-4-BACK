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

// Routes
typeParameterRoutes.post('/create', limiter, ensureAuthenticated, asyncHandler((req, res, next) => createController.handle(req, res, next)));

typeParameterRoutes.put('/update', limiter, ensureAuthenticated, asyncHandler((req, res, next) => updateController.handle(req, res, next)));

typeParameterRoutes.delete('/delete/:id', limiter, ensureAuthenticatedAdmin, asyncHandler((req, res, next) => deleteController.handle(req, res, next)));

typeParameterRoutes.get('/read/:id', limiter, asyncHandler((req, res, next) => readController.handle(req, res, next)));

typeParameterRoutes.get('/list', limiter, asyncHandler((req, res, next) => listController.handle(req, res, next)));

export { typeParameterRoutes }