import { Router } from "express";
import CreateParameterController from "../controllers/parameter/CreateParameterController";
import { CreateParameterUseCase } from "../../application/use-cases/parameter/CreateParameterUseCase";
import { ParameterRepository } from "../../infrastructure/repositories/ParameterRepository";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import { ListParameterUseCase } from "../../application/use-cases/parameter/ListParameterUseCase";
import { ListParameterController } from "../controllers/parameter/ListParameterController";
import UpdateParameterUseCase from "../../application/use-cases/parameter/UpdateParameterUseCase";
import { UpdateParameterController } from "../controllers/parameter/UpdateParameterController";
import DeleteParameterUseCase from "../../application/use-cases/parameter/DeleteParameterUseCase";
import { DeleteParameterController } from "../controllers/parameter/DeleteParameterController";
import { asyncHandler } from "../middlewares/asyncHandler";

const parameterRoutes = Router();
const parameterRepository = new ParameterRepository();

// Create
const createParameterUseCase = new CreateParameterUseCase(parameterRepository);
const createController = new CreateParameterController(createParameterUseCase);


// List
const listParameterUseCase = new ListParameterUseCase(parameterRepository);
const listController = new ListParameterController(listParameterUseCase);

// Update
const updateParameterUseCase = new UpdateParameterUseCase(parameterRepository);
const updateController = new UpdateParameterController(updateParameterUseCase);

// Delete
const deleteParameterUseCase = new DeleteParameterUseCase(parameterRepository);
const deleteController = new DeleteParameterController(deleteParameterUseCase);


// Routes
parameterRoutes.post('/create', limiter, ensureAuthenticated, asyncHandler((req, res, next) => createController.handle(req, res, next)));
parameterRoutes.get('/list', limiter, ensureAuthenticated, asyncHandler((req, res, next) => listController.handle(req, res, next)));

parameterRoutes.put('/update', limiter, ensureAuthenticated, asyncHandler((req, res, next) => updateController.handle(req, res, next)));

parameterRoutes.delete('/delete/:id', limiter, ensureAuthenticated, asyncHandler((req, res, next) => deleteController.handle(req, res, next)));

export { parameterRoutes }