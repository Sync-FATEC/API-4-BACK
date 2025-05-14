import { Request, NextFunction } from 'express';
import { PasswordResetService } from '../../../application/services/PasswordResetService';

export class PasswordResetController {
    private service: PasswordResetService;

    constructor() {
        this.service = new PasswordResetService();
    }

    async requestReset(request: Request, response, next: NextFunction): Promise<Response> {
        try {
            const { email } = request.body;

            if (!email) {
                return response.sendError('Email é obrigatório', 400);
            }

            await this.service.requestReset(email);

            // Não confirmar explicitamente se o email existe para evitar vazamento de informação
            return response.sendSuccess({
                message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.'
            }, 200);
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(request: Request, response, next: NextFunction): Promise<Response> {
        try {
            const { token } = request.params;
            const { password } = request.body;

            if (!token || !password) {
                return response.sendError('Token e senha são obrigatórios', 400);
            }

            await this.service.resetPassword(token, password);

            return response.sendSuccess({
                message: 'Senha redefinida com sucesso'
            }, 200);
        } catch (error) {
            next(error);
        }
    }
}