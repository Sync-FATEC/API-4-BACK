import { NextFunction, Request, Response } from "express";
import { DeleteTypeAlertUseCase } from "../../../application/use-cases/typeAlert/DeleteTypeAlertUseCase";
import { ListTypeAlertUseCase } from "../../../application/use-cases/typeAlert/ListTypeAlertUseCase";
import { ReadTypeAlertUseCase } from "../../../application/use-cases/typeAlert/ReadTypeAlertUseCase";
import { RegisterTypeAlertUseCase } from "../../../application/use-cases/typeAlert/RegisterTypeAlertUseCase";
import { UpdateTypeAlertUseCase } from "../../../application/use-cases/typeAlert/UpdateTypeAlertUseCase";
import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { Criticality } from "../../../domain/enums/TypeAlert/Criticality";

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

  async create(req: Request, response, next: NextFunction) {
    try {
      const { name, comparisonOperator, value, criticality, parameterId } =
        req.body;

      if (!name || !comparisonOperator || !value || !parameterId) {
        throw new SystemContextException("Dados incompletos");
      }

      const typeAlert = await this.registerUseCase.execute({
        name,
        comparisonOperator,
        value,
        criticality,
        parameterId,
      });

      return response.sendSuccess(typeAlert, 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, response, next: NextFunction) {
    try {
      const { id, name, comparisonOperator, value, criticality, parameterId } =
        req.body;

      if (
        !id ||
        !name ||
        !comparisonOperator ||
        !value ||
        !parameterId
      ) {
        throw new SystemContextException("Dados incompletos");
      }

      const typeAlerts = await this.updateUseCase.execute({
        id,
        name,
        comparisonOperator,
        criticality,
        value,
        parameterId,
      });

      return response.sendSuccess(typeAlerts, 200);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, response, next: NextFunction) {
    try {
      const { id } = req.params;
      const typeAlert = await this.readUseCase.execute(id);

      return response.sendSuccess(typeAlert, 200);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, response, next: NextFunction) {
    try {
      const list = await this.listUseCase.execute();
      return response.sendSuccess(list, 200);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.deleteUseCase.execute(id);

      return response.sendSuccess("Deletado com sucesso", 200);
    } catch (error) {
      next(error);
    }
  }
}
