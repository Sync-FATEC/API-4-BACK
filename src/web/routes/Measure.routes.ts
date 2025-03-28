import { Router } from "express";
import { MeasureRepository } from "../../infrastructure/repositories/MeasureRepository";
import { RegisterMeasureUseCase } from "../../application/use-cases/measure/RegisterMeasureUseCase";
import { UpdateMeasureUseCase } from "../../application/use-cases/measure/UpdateMeasureUseCase";
import { ListMeasureUseCase } from "../../application/use-cases/measure/ListMeasureUseCase";
import { ReadMeasureUseCase } from "../../application/use-cases/measure/ReadMeasureUseCase";
import { DeleteMeasureUseCase } from "../../application/use-cases/measure/DeleteMeasureUseCase";
import { MeasureController } from "../controllers/Measure/MeasureController";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import { ensureAuthenticatedAdmin } from "../../infrastructure/middlewares/ensureAuthenticatedAdmin";
import { ParameterRepository } from "../../infrastructure/repositories/ParameterRepository";
import { asyncHandler } from "../middlewares/asyncHandler";

// Repositories
const measureRepository = new MeasureRepository();
const parameterRepository = new ParameterRepository(); // Definido antes de ser utilizado

// Use Cases
const registerMeasureUseCase = new RegisterMeasureUseCase(measureRepository, parameterRepository);
const updateMeasureUseCase = new UpdateMeasureUseCase(measureRepository);
const listMeasureUseCase = new ListMeasureUseCase(measureRepository);
const readMeasureUseCase = new ReadMeasureUseCase(measureRepository);
const deleteMeasureUseCase = new DeleteMeasureUseCase(measureRepository);

// Controller
const measureController = new MeasureController(
  registerMeasureUseCase,
  updateMeasureUseCase,
  listMeasureUseCase,
  readMeasureUseCase,
  deleteMeasureUseCase
);

const measureRoutes = Router();

// Routes
measureRoutes.post('/create', limiter, ensureAuthenticatedAdmin, asyncHandler((req, res, next) => measureController.create(req, res, next)));
measureRoutes.put('/update', limiter, ensureAuthenticatedAdmin, asyncHandler((req, res, next) => measureController.update(req, res, next)));
measureRoutes.get('/list', limiter, asyncHandler((req, res, next) => measureController.getAll(req, res, next)));
measureRoutes.get('/read/:id', limiter, asyncHandler((req, res, next) => measureController.getById(req, res, next)));
measureRoutes.delete('/delete/:id', limiter, ensureAuthenticatedAdmin, asyncHandler((req, res, next) => measureController.delete(req, res, next)));

export { measureRoutes };
