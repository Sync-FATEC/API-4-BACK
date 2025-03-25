import { Router } from "express";
import { AlertRepository } from "../../infrastructure/repositories/AlertRepository";
import { DeleteAlertUseCase } from "../../application/use-cases/alert/DeleteAlertUseCase";
import { ListAlertUseCase } from "../../application/use-cases/alert/ListAlertUseCase";
import { ReadAlertUseCase } from "../../application/use-cases/alert/ReadAlertUseCase";
import { RegisterAlertUseCase } from "../../application/use-cases/alert/RegisterAlertUseCase";
import { UpdateAlertUseCase } from "../../application/use-cases/alert/UpdateAlertUseCase";
import { AlertController } from "../controllers/Alert/AlertController";
import { limiter } from "../../infrastructure/middlewares/limiter";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import { ensureAuthenticatedAdmin } from "../../infrastructure/middlewares/ensureAuthenticatedAdmin";
import { TypeAlertRepository } from "../../infrastructure/repositories/TypeAlertRepository";
import { MeasureRepository } from "../../infrastructure/repositories/MeasureRepository";

// Repositories
const alertRepository = new AlertRepository();
const typeAlertRepository = new TypeAlertRepository(); // Definido antes de ser utilizado
const measureRepository = new MeasureRepository();

// Use Cases
const registerAlertUseCase = new RegisterAlertUseCase(alertRepository, typeAlertRepository);
const updateAlertUseCase = new UpdateAlertUseCase(alertRepository, typeAlertRepository, measureRepository);
const listAlertUseCase = new ListAlertUseCase(alertRepository);
const readAlertUseCase = new ReadAlertUseCase(alertRepository);
const deleteAlertUseCase = new DeleteAlertUseCase(alertRepository);

// Controller
const alertController = new AlertController(
  registerAlertUseCase,
  updateAlertUseCase,
  listAlertUseCase,
  readAlertUseCase,
  deleteAlertUseCase
);

const alertRoutes = Router();

// Routes
alertRoutes.post('/create', limiter, ensureAuthenticatedAdmin, (req, res) => alertController.create(req, res));
alertRoutes.put('/update', limiter, ensureAuthenticatedAdmin, (req, res) => alertController.update(req, res));
alertRoutes.get('/list', limiter, ensureAuthenticated, (req, res) => alertController.getAll(req, res));
alertRoutes.get('/read/:id', limiter, ensureAuthenticated, (req, res) => alertController.getById(req, res));
alertRoutes.delete('/delete/:id', limiter, ensureAuthenticatedAdmin, (req, res) => alertController.delete(req, res));

export { alertRoutes };
