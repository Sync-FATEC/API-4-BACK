import { Request, Response, NextFunction } from 'express';
import { SystemContextException } from '../../domain/exceptions/SystemContextException';

export function ExceptionMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err instanceof SystemContextException) {
        res.sendError(err.message, 400);
    } else {
        res.sendError('Erro interno do servidor', 500);
    }
}