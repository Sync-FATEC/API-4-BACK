import { Router } from "express";
import { TypeAlertController } from "../controllers/typeAlert/TypeAlertController";
import { ensureAuthenticatedAdmin } from "../../infrastructure/middlewares/ensureAuthenticatedAdmin";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { DeleteTypeAlertUseCase } from "src/application/use-cases/typeAlert/DeleteTypeAlertUseCase";
import { ListTypeAlertUseCase } from "src/application/use-cases/typeAlert/ListTypeAlertUseCase";
import { ReadTypeAlertUseCase } from "src/application/use-cases/typeAlert/ReadTypeAlertUseCase";
import { RegisterTypeAlertUseCase } from "src/application/use-cases/typeAlert/RegisterTypeAlertUseCase";
import { UpdateTypeAlertUseCase } from "src/application/use-cases/typeAlert/UpdateTypeAlertUseCase";
import { IParameterRepository } from "src/domain/interfaces/repositories/IParameterRepository";
import { ITypeAlertRepository } from "src/domain/interfaces/repositories/ITypeAlertRepository";
import { ParameterRepository } from "src/infrastructure/repositories/ParameterRepository";
import { TypeAlertRepository } from "src/infrastructure/repositories/TypeAlertRepository";


const typeAlertRoutes = Router();

const parameterRepository: IParameterRepository = new ParameterRepository();
const typeAlertRepository: ITypeAlertRepository = new TypeAlertRepository();

const registerTypeAlertUseCase = new RegisterTypeAlertUseCase(parameterRepository, typeAlertRepository);
const updateTypeAlertUseCase = new UpdateTypeAlertUseCase(parameterRepository, typeAlertRepository);
const listTypeAlertUseCase = new ListTypeAlertUseCase(typeAlertRepository);
const readTypeAlertUseCase = new ReadTypeAlertUseCase(typeAlertRepository);
const deleteTypeAlertUseCase = new DeleteTypeAlertUseCase(typeAlertRepository);

const typeAlertController = new TypeAlertController(
    registerTypeAlertUseCase,
    updateTypeAlertUseCase,
    listTypeAlertUseCase,
    readTypeAlertUseCase,
    deleteTypeAlertUseCase
);

// Routes
typeAlertRoutes.post(
    "/",
    limiter,
    ensureAuthenticatedAdmin,
    (req, res) => typeAlertController.create(req, res)
);

typeAlertRoutes.put(
    "/",
    limiter,
    ensureAuthenticatedAdmin,
    (req, res) => typeAlertController.update(req, res)
);

typeAlertRoutes.get(
    "/",
    limiter,
    ensureAuthenticated,
    (req, res) => typeAlertController.getAll(req, res)
);

typeAlertRoutes.get(
    "/:id",
    limiter,
    ensureAuthenticated,
    (req, res) => typeAlertController.getById(req, res)
);

typeAlertRoutes.delete(
    "/:id",
    limiter,
    ensureAuthenticatedAdmin,
    (req, res) => typeAlertController.delete(req, res)
);

export { typeAlertRoutes };