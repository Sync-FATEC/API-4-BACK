import { SystemContextException } from '@/domain/exceptions/SystemContextException';
import { Request, Response, NextFunction } from 'express';

export function ExceptionMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err instanceof SystemContextException) {
        res.status(400).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'Por favor contate o administrador' });
    }
}