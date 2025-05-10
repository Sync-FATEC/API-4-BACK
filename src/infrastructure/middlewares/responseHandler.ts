import { Request, Response, NextFunction } from 'express';
import { ResponseModelDTO } from '../../web/dtos/ResponseModelDTO';

/**
 * Estende o objeto Response do Express para incluir métodos de resposta padronizados
 */
export const responseHandler = (req: Request, res: Response, next: NextFunction): void => {
    // Método para enviar resposta de sucesso
    res.sendSuccess = function<T>(data: T, status: number = 200): Response {
        const responseDTO = ResponseModelDTO.success(data);
        return this.status(status).json(responseDTO.toJSON());
    };

    // Método para enviar resposta de erro
    res.sendError = function(message: string, status: number = 400): Response {
        const responseDTO = ResponseModelDTO.error(message, status);
        return this.status(status).json(responseDTO.toJSON());
    };

    next();
};

// Estende a interface Response do Express
declare global {
    namespace Express {
        interface Response {
            sendSuccess<T>(data: T, status?: number): Response;
            sendError(message: string, status?: number): Response;
        }
    }
} 