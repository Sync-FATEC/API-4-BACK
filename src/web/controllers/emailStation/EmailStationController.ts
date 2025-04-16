import { NextFunction, Request, Response } from "express";
import { RegisterEmailStationUseCase } from "../../../application/use-cases/emailStation/RegisterEmailStationUseCase";
import { SystemContextException } from "../../../domain/exceptions/SystemContextException";

export class EmailStationController {
  private emailStationUseCase: RegisterEmailStationUseCase;

  constructor(emailStationUseCase: RegisterEmailStationUseCase) {
      this.emailStationUseCase = emailStationUseCase;
  }

  async create(req: Request, res, next: NextFunction): Promise<Response> {
      const { email, stationId } = req.body;

      if (!email) {
        throw new SystemContextException('E-mail obrigatório');
      }

      if (!stationId) {
        throw new SystemContextException('Estação obrigatória');
      }

      this.emailStationUseCase.execute(email, stationId);

      return res.sendSuccess({ legal: "legal" }, 200);
  }
}
