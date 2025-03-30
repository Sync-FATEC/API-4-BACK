import { NextFunction, Request } from "express";
import CreateTypeParamatersDTO from "../../dtos/typeParameter/CreateTypeParameterDTO";
import { CreateTypeParameterUseCase } from "../../../application/use-cases/typeParameter/CreateTypeParameterUseCase";

export default class CreateTypeParameterController {
  constructor(private createTypeParametersUseCase: CreateTypeParameterUseCase) {}

  async handle(request: Request, response, next: NextFunction) {
    const { name, unit, numberOfDecimalsCases, factor, offset, typeJson } = request.body;
    if (!name || !unit || !numberOfDecimalsCases || factor === undefined || offset === undefined || !typeJson) {
      return response.sendError("Dados incompletos", 400);
    }

    const typeParametersData: CreateTypeParamatersDTO = new CreateTypeParamatersDTO(name, unit, numberOfDecimalsCases, factor, offset, typeJson);
    try {
      const typeParameters = await this.createTypeParametersUseCase.execute(typeParametersData);
      
      return response.sendSuccess(typeParameters, 200);
    } catch (error) {
      return response.sendError(
        error instanceof Error ? error.message : "Erro inesperado"
      );
    }
  }
}