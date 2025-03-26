import { NextFunction, Request } from "express";
import DeleteTypeParameterUseCase from "../../../application/use-cases/typeParameter/DeleteTypeParameterUsecase";

export class DeleteTypeParameterController {
    constructor(private deleteTypeParameterUseCase: DeleteTypeParameterUseCase) {}

    async handle(request: Request, res, next: NextFunction): Promise<Response> {
        try {
            const { id } = request.params;

            if (!id) {
                return res.sendError('Parâmetro de tipo não encontrado ou inexistente', 400);
            }

            await this.deleteTypeParameterUseCase.execute(id);

            return res.sendSuccess('Parâmetro de tipo deletado com sucesso', 200);
        } catch (error) {
            next(error);
        }
    }
}