import { Request, Response, NextFunction } from "express";
import { QueryFailedError } from "typeorm";
import { SystemContextException } from "../../domain/exceptions/SystemContextException";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.sendError) {
    const sendError = (message: string, status: number) => res.sendError(message, status);

    if (err instanceof SystemContextException) {
      return sendError(err.message, 400);
    }

    if (err instanceof QueryFailedError) {
      const errorCode = (err as any).code;
      if (errorCode === "23503") {
        return sendError("Não é possível excluir ou atualizar este item, pois ele está em uso.", 400);
      }
    }
    
    console.error(err);
    return sendError("Ocorreu um erro inesperado no servidor.", 500);
  }
};
