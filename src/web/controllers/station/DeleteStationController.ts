import { NextFunction, Request } from "express";
import DeleteStationUseCase from "../../../application/use-cases/station/DeleteStationUseCase";

export class DeleteStationController {
    constructor(private deleteStationUseCase: DeleteStationUseCase) {}

    async handle(request: Request, res, next: NextFunction): Promise<Response> {
        try {
            const { id } = request.params;

            if (!id) {
                return res.sendError('Estação não encontrada ou inexistente', 400);
            }

            await this.deleteStationUseCase.execute(id);

            return res.sendSuccess('Estação deletada com sucesso', 200);
        } catch (error) {
            next(error);
        }
    }
}