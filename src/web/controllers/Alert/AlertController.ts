import { NextFunction, Request } from "express";
import RegisterAlertUseCase from "../../../application/use-cases/alert/RegisterAlertUseCase";
import { UpdateAlertUseCase } from "../../../application/use-cases/alert/UpdateAlertUseCase";
import { ListAlertUseCase } from "../../../application/use-cases/alert/ListAlertUseCase";
import { ReadAlertUseCase } from "../../../application/use-cases/alert/ReadAlertUseCase";
import { DeleteAlertUseCase } from "../../../application/use-cases/alert/DeleteAlertUseCase";

export class AlertController {
  private registerUseCase: RegisterAlertUseCase;
  private updateUseCase: UpdateAlertUseCase;
  private listUseCase: ListAlertUseCase;
  private readUseCase: ReadAlertUseCase;
  private deleteUseCase: DeleteAlertUseCase;

  constructor(
    registerUseCase: RegisterAlertUseCase,
    updateUseCase: UpdateAlertUseCase,
    listUseCase: ListAlertUseCase,
    readUseCase: ReadAlertUseCase,
    deleteUseCase: DeleteAlertUseCase
  ) {
    this.registerUseCase = registerUseCase;
    this.updateUseCase = updateUseCase;
    this.listUseCase = listUseCase;
    this.readUseCase = readUseCase;
    this.deleteUseCase = deleteUseCase;
  }

  async create(req: Request, res, next: NextFunction): Promise<Response> {
    try {
      const { date, typeAlerdId, measureId } = req.body;
      const alert = await this.registerUseCase.execute({ date, typeAlerdId, measureId });
      return res.sendSuccess(alert, 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res, next: NextFunction): Promise<Response> {
    try {
      const { id, date, typeId, measureId } = req.body;
      const alert = await this.updateUseCase.execute({ id, date, typeId, measureId });
      return res.sendSuccess(alert, 200);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      const alert = await this.readUseCase.execute(id);
      return res.sendSuccess(alert, 200);
    } catch (error) {
      next(error)
    }
  }

  async getAll(req: Request, res, next: NextFunction): Promise<Response> {
    try {
      const stationId: string | null = req.query.stationId
      ? String(req.query.stationId)
      : null;

      const list = await this.listUseCase.execute(stationId);
      return res.sendSuccess(list, 200);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      await this.deleteUseCase.execute(id);

      return res.sendSuccess("Deletado com sucesso", 200 );
    } catch (error) {
      next(error);
    }
  }
}
