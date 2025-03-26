import { NextFunction, Request } from "express";
import DeleteParameterUseCase from "../../../application/use-cases/parameter/DeleteParameterUseCase";

export class DeleteParameterController {
    constructor(private deleteParameterUseCase: DeleteParameterUseCase) {}

    async handle(request: Request, res, next: NextFunction): Promise<Response> {
        try {
            const { id } = request.params;

            if (!id) {
                return res.sendError('Parâmetro não encontrado ou inexistente', 400);
            }

            await this.deleteParameterUseCase.execute(id);

            return res.sendSuccess('Parâmetro deletado com sucesso', 200);
        } catch (error) {
            next(error);
        }
    }
}