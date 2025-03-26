import { NextFunction, Request, Response } from "express";
import UpdateParameterUseCase from "../../../application/use-cases/parameter/UpdateParameterUseCase";
import UpdateParameterDTO from "../../dtos/parameter/UpdateParameterDTO";

export class UpdateParameterController {
    constructor(private updateParameterUseCase: UpdateParameterUseCase) {}

    async handle(request: Request, response, next: NextFunction): Promise<Response> {
        try {
            const { id, idTypeParameter, idStation } = request.body;

            if (!id || !idTypeParameter || !idStation) {
                return response.sendError("Dados incompletos", 400);
            }

            const parameterData: UpdateParameterDTO = new UpdateParameterDTO(id, idTypeParameter, idStation);

            const parameter = await this.updateParameterUseCase.execute(parameterData);

            return response.sendSuccess(parameter, 200);
        } catch (error) {
            next(error);
        }
    }
}