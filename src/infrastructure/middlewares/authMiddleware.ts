import { Request, Response, NextFunction } from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            name: string;
            role: string;
        };
    }
}
import { verify } from 'jsonwebtoken';

interface TokenPayload {
    name: string;
    role: string;
    iat: number;
    exp: number;
}

export function authMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
): void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new Error('JWT token is missing');
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, process.env.JWT_SECRET || 'default_secret');
        const { name, role } = decoded as TokenPayload;

        request.user = {
            name,
            role
        };

        return next();
    } catch {
        throw new Error('Invalid JWT token');
    }
} 