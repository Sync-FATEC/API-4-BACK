import ChangePasswordUseCase from "../../../application/use-cases/user/ChangePasswordUseCase";
import { NextFunction, Request  } from "express";
import { ChangePasswordDTO } from "../../dtos/user/ChangePasswordDTO";

export class ChangePasswordController {
    constructor(private changePasswordUseCase: ChangePasswordUseCase) {}

    async handle(request: Request, response, next: NextFunction): Promise<Response> {
        try {
            const { email, currentPassword, newPassword, confirmPassword } = request.body;

            if (!email || !currentPassword || !newPassword || !confirmPassword) {
                return response.sendError('Dados inválidos', 400);
            }

            const userData: ChangePasswordDTO = new ChangePasswordDTO(email, currentPassword, newPassword, confirmPassword);

            await this.changePasswordUseCase.execute(userData);

            return response.sendSuccess("Senha atualizada com sucesso", 200);
        } catch (error) {
            next(error);
        }
    }
}