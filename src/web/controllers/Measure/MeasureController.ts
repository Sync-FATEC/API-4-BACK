import { Request } from "express";
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

  async getById(req: Request, res: any): Promise<any> {
    try {
      const { id } = req.params;
      const measure = await this.readUseCase.execute(id);
      return res.sendSuccess({ measure }, 200);
    } catch (error) {
      return res.sendError({ error }, 400);
    }
  }

  async getAll(req: Request, res: any): Promise<any> {
    try {
      const measures = await this.listUseCase.execute();
      return res.sendSuccess({ measures }, 200);
    } catch (error) {
      return res.sendError({ error }, 400);
    }
  }
}
