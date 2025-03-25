import { Router } from "express";
import CreateParameterController from "../controllers/parameter/CreateParameterController";
import { CreateParameterUseCase } from "../../application/use-cases/parameter/CreateParameterUseCase";
import { ParameterRepository } from "../../infrastructure/repositories/ParameterRepository";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import { ListParameterUseCase } from "../../application/use-cases/parameter/ListParameterUseCase";
import { ListParameterController } from "../controllers/parameter/ListParameterController";

const parameterRoutes = Router();
const parameterRepository = new ParameterRepository();

// Create
const createParameterUseCase = new CreateParameterUseCase(parameterRepository);
const createController = new CreateParameterController(createParameterUseCase);

// List
const listParameterUseCase = new ListParameterUseCase(parameterRepository);
const listController = new ListParameterController(listParameterUseCase);

// Routes
parameterRoutes.post('/create', limiter, ensureAuthenticated, (req, res) => createController.handle(req, res));
parameterRoutes.get('/list', limiter, ensureAuthenticated, (req, res) => listController.handle(req, res));

export { parameterRoutes }