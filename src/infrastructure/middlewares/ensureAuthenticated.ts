import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            name: string;
            role: string;
        };
    }
}

interface TokenPayload {
    name: string;
    role: string;
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
        return response.sendError('JWT token is missing', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, process.env.JWT_SECRET) as TokenPayload;
        request.user = { name: decoded.name, role: decoded.role };
        return next();
    } catch (error) {
        return response.sendError('Invalid JWT token', 401);
    }
}