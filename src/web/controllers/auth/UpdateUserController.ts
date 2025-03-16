import { UpdateUserUseCase } from "../../../application/use-cases/auth/UpdateUserUseCase";
import { Request, Response } from 'express';
import { UpdateUserDTO } from "../../dtos/auth/UpdateUserDTO";
import { instanceToPlain } from "class-transformer";

export class UpdateUserController {
    constructor(private updateUserUseCase: UpdateUserUseCase) {}

    async handle(request: Request, response): Promise<Response> {
        try {
            const { id, name, email, password, cpf } = request.body;

            if (!id) {
                return response.sendError('Usuário não encontrado ou inexistente', 400);
            }

            const userData: UpdateUserDTO = new UpdateUserDTO(id, name, email, cpf, password);

            const user = await this.updateUserUseCase.execute(userData);

            return response.sendSuccess(instanceToPlain(user), 200);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
}