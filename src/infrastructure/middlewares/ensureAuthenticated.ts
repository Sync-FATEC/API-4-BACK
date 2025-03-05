import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface TokenPayload {
    id: string;
    iat: number;
    exp: number;
}

export function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
): Response | void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.sendError('Token não fornecido', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, process.env.JWT_SECRET || 'secret');
        const { id } = decoded as TokenPayload;

        request.user = {
            id
        };

        return next();
    } catch (error) {
        return response.sendError('Token inválido', 401);
    }
} 