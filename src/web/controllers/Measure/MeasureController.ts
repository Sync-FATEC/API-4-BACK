import { Request, Response } from "express";
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

  // Criar um novo Measure
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { unixTime, value } = req.body;
      const measure = await this.registerUseCase.execute({ unixTime, value });

      return res.status(201).json({
        success: true,
        data: measure
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal Server Error'
      });
    }
  }

  // Atualizar um Measure
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id, unixTime, value } = req.body;
      const updatedMeasure = await this.updateUseCase.execute({ id, unixTime, value });

      return res.status(200).json({
        success: true,
        data: updatedMeasure
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal Server Error'
      });
    }
  }

  // Obter um Measure por ID
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const measure = await this.readUseCase.execute(id);

      return res.status(200).json({
        success: true,
        data: measure
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal Server Error'
      });
    }
  }

  // Listar todos os Measures
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const measures = await this.listUseCase.execute();

      return res.status(200).json({
        success: true,
        data: measures
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal Server Error'
      });
    }
  }

  // Deletar um Measure
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.deleteUseCase.execute(id);

      return res.status(200).json({
        success: true,
        message: 'Measure deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal Server Error'
      });
    }
  }
}
