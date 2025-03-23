import { Router } from "express";
import CreateTypeParametersController from "../controllers/typeParameters/CreateTypeParameterController";
import TypeParemeterRepository from "../../infrastructure/repositories/TypeParameterRepository";
import { CreateTypeParameterUseCase } from "../../application/use-cases/typeParameter/CreateTypeParameterUseCase";
import UpdateTypeParameterUseCase from "../../application/use-cases/typeParameter/UpdateTypeParameterUseCase";
import { UpdateTypeParameterController } from "../controllers/typeParameters/UpdateTypeParameterController";

const typeParameterRoutes = Router();
const typeParametersRepository = new TypeParemeterRepository();

// Create
const createTypeParameterUseCase = new CreateTypeParameterUseCase(typeParametersRepository);
const createController = new CreateTypeParametersController(createTypeParameterUseCase);

// Update
const updateTypeParameterUseCase = new UpdateTypeParameterUseCase(typeParametersRepository);
const updateController = new UpdateTypeParameterController(updateTypeParameterUseCase);

// Routes
typeParameterRoutes.post('/create', (req, res) => createController.handle(req, res));

typeParameterRoutes.put('/update', (req, res) => updateController.handle(req, res));

export { typeParameterRoutes }