import ChangePasswordUseCase from "../../../application/use-cases/user/ChangePasswordUseCase";
import { Request  } from "express";
import { ChangePasswordDTO } from "../../dtos/user/ChangePasswordDTO";

export class ChangePasswordController {
    constructor(private changePasswordUseCase: ChangePasswordUseCase) {}

    async handle(request: Request, response): Promise<Response> {
        try {
            const { email, oldPassword, password, passwordConfirmation } = request.body;

            if ( !email || !oldPassword || !password || !passwordConfirmation ) {
                return response.sendError('Dados inválidos', 400);
            }

            const userData: ChangePasswordDTO = new ChangePasswordDTO(email, oldPassword, password, passwordConfirmation);

            await this.changePasswordUseCase.execute(userData);

            return response.sendSuccess("Senha atualizada", 200);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
}