
import { Request, Response } from "express";
import { DeleteTypeAlertUseCase } from "src/application/use-cases/typeAlert/DeleteTypeAlertUseCase";
import { ListTypeAlertUseCase } from "src/application/use-cases/typeAlert/ListTypeAlertUseCase";
import { ReadTypeAlertUseCase } from "src/application/use-cases/typeAlert/ReadTypeAlertUseCase";
import { RegisterTypeAlertUseCase } from "src/application/use-cases/typeAlert/RegisterTypeAlertUseCase";
import { UpdateTypeAlertUseCase } from "src/application/use-cases/typeAlert/UpdateTypeAlertUseCase";

export class TypeAlertController {
  private registerUseCase: RegisterTypeAlertUseCase;
  private updateUseCase: UpdateTypeAlertUseCase;
  private listUseCase: ListTypeAlertUseCase;
  private readUseCase: ReadTypeAlertUseCase;
  private deleteUseCase: DeleteTypeAlertUseCase;

  constructor(
    registerUseCase: RegisterTypeAlertUseCase,
    updateUseCase: UpdateTypeAlertUseCase,
    listUseCase: ListTypeAlertUseCase,
    readUseCase: ReadTypeAlertUseCase,
    deleteUseCase: DeleteTypeAlertUseCase
  ) {
    this.registerUseCase = registerUseCase;
    this.updateUseCase = updateUseCase;
    this.listUseCase = listUseCase;
    this.readUseCase = readUseCase;
    this.deleteUseCase = deleteUseCase;
  }

  async create(req: Request, response): Promise<Response> {
    try {
      const { name, comparisonOperator, value, parameterId } = req.body;

      const typeAlert = await this.registerUseCase.execute({
        name,
        comparisonOperator,
        value,
        parameterId,
      });

      return response.status(201).json(typeAlert);
    } catch (error) {}
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id, name, comparisonOperator, value, parameterId } = req.body;

      const typeAlerts = await this.updateUseCase.execute({
        id,
        name,
        comparisonOperator,
        value,
        parameterId,
      });

      return res.status(200).json(typeAlerts);
    } catch (error) {}
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const typeAlert = await this.readUseCase.execute(id);

      return res.status(200).json({ success: true, data: typeAlert });
    } catch (error) {}
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const list = await this.listUseCase.execute();

      return res.status(200).json({ success: true, data: list });
    } catch (error) {}
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.deleteUseCase.execute(id);

      return res.status(204).send();
    } catch (error) {}
  }
}
