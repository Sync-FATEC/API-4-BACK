import { Request, Response } from 'express';
import { RegisterUseCase } from '../../../application/use-cases/auth/RegisterUseCase';
import RegisterUserDTO from '../../dtos/auth/RegisterUserDTO';

export class RegisterController {
    constructor(private registerUseCase: RegisterUseCase) {}

    async handle(request: Request, response): Promise<Response> {
        try {
            const { name, email, password, cpf } = request.body;

            if (!name || !email || !password || !cpf) {
                return response.sendError('Nome, email, senha e CPF são obrigatórios', 400);
            }

            const userData: RegisterUserDTO = new RegisterUserDTO(name, email, password, cpf);

            const { user, token } = await this.registerUseCase.execute(userData);

            return response.sendSuccess({ user, token }, 200);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
} 