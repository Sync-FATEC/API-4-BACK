import { Router } from "express";
import CreateTypeParametersController from "../controllers/typeParameters/CreateTypeParameterController";
import TypeParemeterRepository from "../../infrastructure/repositories/TypeParameterRepository";
import { CreateTypeParameterUseCase } from "../../application/use-cases/typeParameter/CreateTypeParameterUseCase";
import UpdateTypeParameterUseCase from "../../application/use-cases/typeParameter/UpdateTypeParameterUseCase";
import { UpdateTypeParameterController } from "../controllers/typeParameters/UpdateTypeParameterController";
import DeleteTypeParameterUseCase from "../../application/use-cases/typeParameter/DeleteTypeParameterUsecase";
import { DeleteTypeParameterController } from "../controllers/typeParameters/DeleteTypeParameterController";
import { ReadTypeParameterUseCase } from "../../application/use-cases/typeParameter/ReadTypeParameterUseCase";
import { ReadTypeParameterController } from "../controllers/typeParameters/ReadTypeParameterController";
import { ListTypeParameterUseCase } from "../../application/use-cases/typeParameter/ListTypeParameterUsecase";
import { ListTypeParameterController } from "../controllers/typeParameters/ListTypeParameterController";

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
typeParameterRoutes.post('/create', (req, res) => createController.handle(req, res));

typeParameterRoutes.put('/update', (req, res) => updateController.handle(req, res));

typeParameterRoutes.delete('/delete/:id', (req, res) => deleteController.handle(req, res));

typeParameterRoutes.get('/read/:id', (req, res) => readController.handle(req, res));

typeParameterRoutes.get('/list', (req, res) => listController.handle(req, res));

export { typeParameterRoutes }