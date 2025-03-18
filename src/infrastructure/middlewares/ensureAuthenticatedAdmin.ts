import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth/AuthService';
import { UserRequest } from '../../domain/interfaces/TokenPayload';

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserRequest;
    }
}

export function ensureAuthenticatedAdmin(
    request: Request,
    response: Response,
    next: NextFunction
): void {
    try {
        const authService = AuthService.getInstance();
        const token = authService.extractTokenFromHeader(request.headers.authorization);
        const decoded = authService.verifyToken(token);

        request.user = {
            name: decoded.name,
            role: decoded.role
        };

        authService.validateAdminRole(decoded.role);
        next();
    } catch (error) {
        response.sendError(
            error instanceof Error ? error.message : 'Erro de autenticação',
            401
        );
    }
}