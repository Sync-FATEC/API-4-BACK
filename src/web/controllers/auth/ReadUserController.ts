import { ReadUserUseCase } from "../../../application/use-cases/auth/ReadUserUseCase";
import { Request, Response } from "express";

export default class ReadUserController {
    constructor(private readUserUseCase: ReadUserUseCase) {}

    async handle(request: Request, response): Promise<Response> {
        try {
            const { id } = request.params;

            if (!id) {
                return response.sendError('Usuário não encontrado ou inexistente', 400);
            }

            const user = await this.readUserUseCase.execute(id);

            return response.sendSuccess(user, 200);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
}