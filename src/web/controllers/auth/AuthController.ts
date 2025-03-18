import { Request, Response } from 'express';
import { AuthUseCase } from '../../../application/use-cases/auth/AuthUseCase';

export class AuthController {
    constructor(private authUseCase: AuthUseCase) {}

    async login(request: Request, response): Promise<Response> {
        try {
            const { email, password } = request.body;

            if (!email) {
                return response.sendError('Email é obrigatórios', 400);
            }

            const { user, token } = await this.authUseCase.execute(email, password);

            return response.sendSuccess({ user, token }, 200);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
} 