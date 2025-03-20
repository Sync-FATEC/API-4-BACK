import { Router } from "express";
import CreateStationController from "../controllers/station/CreateStationController";
import { DeleteStationController } from "../controllers/station/DeleteStationController";
import { ListStationController } from "../controllers/station/ListStationController";
import { ReadStationController } from "../controllers/station/ReadStationController";
import { UpdateStationController } from "../controllers/station/UpdateStationController";
import { CreateStationUseCase } from "../../application/use-cases/station/CreateStationUseCase";
import DeleteStationUseCase from "../../application/use-cases/station/DeleteStationUseCase";
import { ListStationUseCase } from "../../application/use-cases/station/ListStationUseCase";
import { ReadStationUseCase } from "../../application/use-cases/station/ReadStationUseCase";
import UpdateStationUseCase from "../../application/use-cases/station/UpdateStationUseCase";
import { ensureAuthenticated } from "../../infrastructure/middlewares/ensureAuthenticated";
import { ensureAuthenticatedAdmin } from "../../infrastructure/middlewares/ensureAuthenticatedAdmin";
import { limiter } from "../../infrastructure/middlewares/limiter";
import StationRepository from "../../infrastructure/repositories/StationRepository";

const stationRoutes = Router();
const stationRepository = new StationRepository();

// Create
const createStationUseCase = new CreateStationUseCase(stationRepository);
const createController = new CreateStationController(createStationUseCase);

// Update
const updateStationUseCase = new UpdateStationUseCase(stationRepository);
const updateController = new UpdateStationController(updateStationUseCase);

// Delete
const deleteStationUseCase = new DeleteStationUseCase(stationRepository);
const deleteController = new DeleteStationController(deleteStationUseCase);

// List
const listStationUseCase = new ListStationUseCase(stationRepository);
const listController = new ListStationController(listStationUseCase);

// Read
const readStationUseCase = new ReadStationUseCase(stationRepository);
const readController = new ReadStationController(readStationUseCase);

stationRoutes.post('/create', limiter, ensureAuthenticated, (req, res) => createController.handle(req, res));

stationRoutes.put('/update', limiter, ensureAuthenticated, (req, res) => updateController.handle(req, res));

stationRoutes.delete('/delete/:id', limiter, ensureAuthenticatedAdmin, (req, res) => deleteController.handle(req, res));

stationRoutes.get('/list', limiter, ensureAuthenticated, (req, res) => listController.handle(req, res));

stationRoutes.get('/read/:id', limiter, ensureAuthenticated, (req, res) => readController.handle(req, res));

export { stationRoutes }