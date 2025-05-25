import { NextFunction, Request, Response } from 'express';
import { ListDashboardUseCase } from '../../../application/use-cases/dashboard/ListDashboardUseCase';

export class ListDashboardController {
  constructor(private listDashboardUseCase: ListDashboardUseCase) {}

  async handle(req: Request, res, next: NextFunction): Promise<Response> {
    try {
      const { stationId, startDate, endDate } = req.body;
      const measures = await this.listDashboardUseCase.execute(stationId, startDate, endDate);
      return res.sendSuccess(measures);
    } catch (error) {
      next(error);
    }
  }

  async handlePublic(req: Request, res, next: NextFunction): Promise<Response> {
    try {
      const { stationId } = req.params;
      const measures = await this.listDashboardUseCase.execute(stationId, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date());
      return res.sendSuccess(measures);
    } catch (error) {
      next(error);
    }
  }
}
