import { Request, Response } from 'express';
import { RegisterUseCase } from '../../../application/use-cases/auth/RegisterUseCase';

export class RegisterController {
    constructor(private registerUseCase: RegisterUseCase) {}

    async handle(request: Request, response): Promise<Response> {
        try {
            const { name, email, password, cpf, role } = request.body;

            if (!name || !email || !password || !cpf || !role) {
                return response.sendError('Nome, email, senha e CPF são obrigatórios', 400);
            }

            const { user, token } = await this.registerUseCase.execute({
                name,
                email,
                password,
                cpf,
                role
            });

            return response.sendSuccess({ user, token }, 201);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
} 