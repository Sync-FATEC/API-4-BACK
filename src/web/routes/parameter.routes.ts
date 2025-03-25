import { Router } from "express";
import CreateParameterController from "../controllers/parameter/CreateParameterController";
import { CreateParameterUseCase } from "../../application/use-cases/parameter/CreateParameterUseCase";
import { ParameterRepository } from "../../infrastructure/repositories/ParameterRepository";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import UpdateParameterUseCase from "../../application/use-cases/parameter/UpdateParameterUseCase";
import { UpdateParameterController } from "../controllers/parameter/UpdateParameterController";
import DeleteParameterUseCase from "../../application/use-cases/parameter/DeleteParameterUseCase";
import { DeleteParameterController } from "../controllers/parameter/DeleteParameterController";

const parameterRoutes = Router();
const parameterRepository = new ParameterRepository();

// Create
const createParameterUseCase = new CreateParameterUseCase(parameterRepository);
const createController = new CreateParameterController(createParameterUseCase);

// Update
const updateParameterUseCase = new UpdateParameterUseCase(parameterRepository);
const updateController = new UpdateParameterController(updateParameterUseCase);

// Delete
const deleteParameterUseCase = new DeleteParameterUseCase(parameterRepository);
const deleteController = new DeleteParameterController(deleteParameterUseCase);

// Routes
parameterRoutes.post('/create', limiter, ensureAuthenticated, (req, res) => createController.handle(req, res));

parameterRoutes.put('/update', limiter, ensureAuthenticated, (req, res) => updateController.handle(req, res));

parameterRoutes.delete('/delete/:id', limiter, ensureAuthenticated, (req, res) => deleteController.handle(req, res));

export { parameterRoutes }