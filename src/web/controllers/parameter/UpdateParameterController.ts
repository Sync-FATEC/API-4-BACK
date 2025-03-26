import { Request, Response } from "express";
import UpdateParameterUseCase from "../../../application/use-cases/parameter/UpdateParameterUseCase";
import UpdateParameterDTO from "../../dtos/parameter/UpdateParameterDTO";

export class UpdateParameterController {
    constructor(private updateParameterUseCase: UpdateParameterUseCase) {}

    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const { id, idTypeParameter, idStation } = request.body;

            if (!id || !idTypeParameter || !idStation) {
                return response.status(400).json({ error: "Dados incompletos" });
            }

            const parameterData: UpdateParameterDTO = new UpdateParameterDTO(id, idTypeParameter, idStation);

            const parameter = await this.updateParameterUseCase.execute(parameterData);

            return response.status(200).json({ success: true, data: parameter });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erro inesperado";
            return response.status(400).json({ error: errorMessage });
        }
    }
}