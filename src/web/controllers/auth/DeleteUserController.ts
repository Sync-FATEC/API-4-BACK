import { DeleteUserUseCase } from "../../../application/use-cases/auth/DeleteUserUseCase";
import { Request, Response } from "express";

export class DeleteUserController {
    constructor(private deleteUserUseCase: DeleteUserUseCase) {}

    async handle(request: Request, response): Promise<Response> {
        try {
            const { id } = request.params;

            if (!id) {
                return response.sendError('ID é obrigatório', 400);
            }

            await this.deleteUserUseCase.execute(id);

            return response.sendSuccess('Usuário deletado com sucesso', 200);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
}