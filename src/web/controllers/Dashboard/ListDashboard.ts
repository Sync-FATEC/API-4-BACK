import { NextFunction, Request, Response } from 'express';
import { ListDashboardUseCase } from '../../../application/use-cases/dashboard/ListDashboardUseCase';

export class ListDashboardController {
  constructor(private listDashboardUseCase: ListDashboardUseCase) {}

  async getAll(req: Request, res, next: NextFunction): Promise<Response> {
    try {
      const { 
        startDate, 
        endDate, 
        stationId, 
        parameterId 
      } = req.query;

      // Convert query string parameters to appropriate types
      const filters = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        stationId: stationId ? String(stationId) : undefined,
        parameterId: parameterId ? String(parameterId) : undefined
      };

      const dashboardData = await this.listDashboardUseCase.execute(filters);

      return res.sendSuccess(dashboardData, 200);
      
    } catch (error) {
      next(error);
    }
  }
}
