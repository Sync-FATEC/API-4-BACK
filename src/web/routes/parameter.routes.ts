import { Router } from "express";
import CreateParameterController from "../controllers/parameter/CreateParameterController";
import { CreateParameterUseCase } from "../../application/use-cases/parameter/CreateParameterUseCase";
import { ParameterRepository } from "../../infrastructure/repositories/ParameterRepository";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";

const parameterRoutes = Router();
const parameterRepository = new ParameterRepository();

// Create
const createParameterUseCase = new CreateParameterUseCase(parameterRepository);
const createController = new CreateParameterController(createParameterUseCase);

// Routes
parameterRoutes.post('/create', limiter, ensureAuthenticated, (req, res) => createController.handle(req, res));

export { parameterRoutes }