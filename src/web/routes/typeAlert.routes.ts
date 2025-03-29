import { Router } from "express";
import { TypeAlertController } from "../controllers/typeAlert/TypeAlertController";
import { ensureAuthenticatedAdmin } from "../../infrastructure/middlewares/ensureAuthenticatedAdmin";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { DeleteTypeAlertUseCase } from "../../application/use-cases/typeAlert/DeleteTypeAlertUseCase";
import { ListTypeAlertUseCase } from "../../application/use-cases/typeAlert/ListTypeAlertUseCase";
import { ReadTypeAlertUseCase } from "../../application/use-cases/typeAlert/ReadTypeAlertUseCase";
import { RegisterTypeAlertUseCase } from "../../application/use-cases/typeAlert/RegisterTypeAlertUseCase";
import { UpdateTypeAlertUseCase } from "../../application/use-cases/typeAlert/UpdateTypeAlertUseCase";
import { ParameterRepository } from "../../infrastructure/repositories/ParameterRepository";
import TypeAlertRepository from "../../infrastructure/repositories/TypeAlertRepository";
import { asyncHandler } from "../middlewares/asyncHandler";

const typeAlertRoutes = Router();

const parameterRepository = new ParameterRepository();
const typeAlertRepository = new TypeAlertRepository();

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
    ensureAuthenticated,
    asyncHandler((req, res, next) => typeAlertController.create(req, res, next))
);

typeAlertRoutes.put(
    "/",
    limiter,
    ensureAuthenticated,
    asyncHandler((req, res, next) => typeAlertController.update(req, res, next))
);

typeAlertRoutes.get(
    "/",
    limiter,
    asyncHandler((req, res, next) => typeAlertController.getAll(req, res, next))
);

typeAlertRoutes.get(
    "/:id",
    limiter,
    asyncHandler((req, res, next) => typeAlertController.getById(req, res, next))
);

typeAlertRoutes.delete(
    "/:id",
    limiter,
    ensureAuthenticatedAdmin,
    asyncHandler((req, res, next) => typeAlertController.delete(req, res, next))
);

export { typeAlertRoutes };