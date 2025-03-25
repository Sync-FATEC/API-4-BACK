import { Request, Response } from "express";
import { RegisterAlertUseCase } from "../../../application/use-cases/alert/RegisterAlertUseCase";
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

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { date, typeId, measureId } = req.body;
      const alert = await this.registerUseCase.execute({ date, typeId, measureId });

      return res.status(201).json({
        success: true,
        data: alert
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal Server Error'
      });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id, date, typeId, measureId } = req.body;
      const alert = await this.updateUseCase.execute({ id, date, typeId, measureId });

      return res.status(200).json({
        success: true,
        data: alert
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal Server Error'
      });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const alert = await this.readUseCase.execute(id);

      return res.status(200).json({
        success: true,
        data: alert
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal Server Error'
      });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const list = await this.listUseCase.execute();

      return res.status(200).json({
        success: true,
        data: list
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal Server Error'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.deleteUseCase.execute(id);

      return res.status(200).json({
        success: true,
        message: 'Alert deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal Server Error'
      });
    }
  }
}
