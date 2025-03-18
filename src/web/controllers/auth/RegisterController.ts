import { Request, Response } from 'express';
import { RegisterUseCase } from '../../../application/use-cases/auth/RegisterUseCase';
import RegisterUserDTO from '../../dtos/auth/RegisterUserDTO';

export class RegisterController {
    constructor(private registerUseCase: RegisterUseCase) {}

    async handle(request: Request, response): Promise<Response> {
        try {
            const { name, email, cpf } = request.body;

            if (!name || !email || !cpf) {
                return response.sendError('Nome, email e CPF são obrigatórios', 400);
            }

            const userData: RegisterUserDTO = new RegisterUserDTO(name, email, cpf);

            const readUser = await this.registerUseCase.execute(userData);

            return response.sendSuccess({ readUser }, 200);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
} 