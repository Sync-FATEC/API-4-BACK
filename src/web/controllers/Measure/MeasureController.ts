import { NextFunction, Request, Response } from "express";
import { RegisterMeasureUseCase } from "../../../application/use-cases/measure/RegisterMeasureUseCase";
import { UpdateMeasureUseCase } from "../../../application/use-cases/measure/UpdateMeasureUseCase";
import { ListMeasureUseCase } from "../../../application/use-cases/measure/ListMeasureUseCase";
import { ReadMeasureUseCase } from "../../../application/use-cases/measure/ReadMeasureUseCase";
import { DeleteMeasureUseCase } from "../../../application/use-cases/measure/DeleteMeasureUseCase";

export class MeasureController {
  private registerUseCase: RegisterMeasureUseCase;
  private updateUseCase: UpdateMeasureUseCase;
  private listUseCase: ListMeasureUseCase;
  private readUseCase: ReadMeasureUseCase;
  private deleteUseCase: DeleteMeasureUseCase;

  constructor(
    registerUseCase: RegisterMeasureUseCase,
    updateUseCase: UpdateMeasureUseCase,
    listUseCase: ListMeasureUseCase,
    readUseCase: ReadMeasureUseCase,
    deleteUseCase: DeleteMeasureUseCase
  ) {
    this.registerUseCase = registerUseCase;
    this.updateUseCase = updateUseCase;
    this.listUseCase = listUseCase;
    this.readUseCase = readUseCase;
    this.deleteUseCase = deleteUseCase;
  }

  async create(req: Request, res, next: NextFunction): Promise<Response> {
    try {
      const { unixTime, value } = req.body;
      const measure = await this.registerUseCase.execute({ unixTime, value });
      return res.sendSuccess(measure, 201);
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res, next: NextFunction): Promise<Response> {
    try {
      const { id, unixTime, value } = req.body;
      const updatedMeasure = await this.updateUseCase.execute({ id, unixTime, value });
      return res.sendSuccess(updatedMeasure, 200);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      const measure = await this.readUseCase.execute(id);
      return res.sendSuccess(measure, 200);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res, next: NextFunction): Promise<Response> {
    try {
      const measures = await this.listUseCase.execute();
      return res.sendSuccess(measures, 200);
    } catch (error) {
      next(error);
    }
  }
  
  async delete(req: Request, res, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      await this.deleteUseCase.execute(id);
      return res.sendSuccess("Deletado com sucesso", 200);
    } catch (error) {
      next(error);
    }
  }
}
