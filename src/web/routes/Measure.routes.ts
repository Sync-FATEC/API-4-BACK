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
measureRoutes.get('/list', limiter, ensureAuthenticated, (req, res) => measureController.getAll(req, res));
measureRoutes.get('/read/:id', limiter, ensureAuthenticated, (req, res) => measureController.getById(req, res));

export { measureRoutes };
