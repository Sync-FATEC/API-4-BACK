import { NextFunction, Request } from "express";
import CreateParameterDTO from "../../dtos/parameter/CreateParameterDTO";
import { CreateParameterUseCase } from "../../../application/use-cases/parameter/CreateParameterUseCase";

export default class CreateParameterController {
    constructor(private createParameterUseCase: CreateParameterUseCase) {}

    async handle(request: Request, response, next: NextFunction) {
        const { idTypeParameter, idStation } = request.body;

        if (!idTypeParameter || !idStation) {
            return response.sendError("Dados incompletos", 400);
        }

        const parameterData: CreateParameterDTO = new CreateParameterDTO(idTypeParameter, idStation);
        try {
            const parameter = await this.createParameterUseCase.execute(parameterData);
            
            return response.sendSuccess(parameter, 200);
        } catch (error) {
            next(error);
        }
    }
}