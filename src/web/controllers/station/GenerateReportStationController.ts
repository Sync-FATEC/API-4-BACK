import { NextFunction, Request } from "express";
import { gerarPdfEstacoes } from "../../../application/operations/reports/generateStationReport";

export class GenerateReportStationController {

  constructor() {}

  async handle(request: Request, res, next: NextFunction): Promise<Response> {
    try {
      const { id } = request.body;

      if (!id) {
        return res.sendError("Identificador não enviado", 400);
      }

      let arquivo = await gerarPdfEstacoes(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
      return res.send(arquivo); // diretamente o Buffer!
    } catch (error) {
      next(error);
    }
  }
}
