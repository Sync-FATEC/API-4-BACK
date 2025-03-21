import { Request, Response } from "express";
import { DeleteTypeAlertUseCase } from "../../../application/use-cases/typeAlert/DeleteTypeAlertUseCase";
import { ListTypeAlertUseCase } from "../../../application/use-cases/typeAlert/ListTypeAlertUseCase";
import { ReadTypeAlertUseCase } from "../../../application/use-cases/typeAlert/ReadTypeAlertUseCase";
import { RegisterTypeAlertUseCase } from "../../../application/use-cases/typeAlert/RegisterTypeAlertUseCase";
import { UpdateTypeAlertUseCase } from "../../../application/use-cases/typeAlert/UpdateTypeAlertUseCase";

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

      return response.sendSucess({ typeAlert }, 201);
    } catch (error) {}
  }

  async update(req: Request, response): Promise<Response> {
    try {
      const { id, name, comparisonOperator, value, parameterId } = req.body;

      const typeAlerts = await this.updateUseCase.execute({
        id,
        name,
        comparisonOperator,
        value,
        parameterId,
      });

      return response.sendSucess({ typeAlerts }, 200);
    } catch (error) {}
  }

  async getById(req: Request, response): Promise<Response> {
    try {
      const { id } = req.params;
      const typeAlert = await this.readUseCase.execute(id);

      return response.sendSucess({ success: true, data: typeAlert }, 200);
    } catch (error) {}
  }

  async getAll(req: Request, response): Promise<Response> {
    try {
      const list = await this.listUseCase.execute();

      return response.sendSucess({ success: true, data: list }, 200);
    } catch (error) {}
  }

  async delete(req: Request, response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.deleteUseCase.execute(id);

      return response.sendSucess({}, 200);
    } catch (error) {}
  }
}
