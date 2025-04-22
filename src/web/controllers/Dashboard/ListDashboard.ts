import { NextFunction, Request, Response } from 'express';
import { ListDashboardUseCase } from '../../../application/use-cases/dashboard/ListDashboardUseCase';

export class ListDashboardController {
  constructor(private listDashboardUseCase: ListDashboardUseCase) {}

  async getAll(req: Request, res, next: NextFunction): Promise<Response> {
    try {
      const { 
        startDate, 
        endDate, 
        date,
        stationId, 
        parameterId,
        lastDays
      } = req.query;

      let startDateObj: Date | undefined = undefined;
      let endDateObj: Date | undefined = undefined;
      
      if (lastDays) {
        const days = parseInt(lastDays as string, 10);
        endDateObj = new Date();
        startDateObj = new Date();
        startDateObj.setDate(startDateObj.getDate() - days);
      }
      else if (date) {
        const dateStr = date as string;
        
        startDateObj = new Date(`${dateStr}T00:00:00-03:00`);
        endDateObj = new Date(`${dateStr}T23:59:59.999-03:00`);
      } 
      else {
        if (startDate) {
          startDateObj = new Date(startDate as string);
        }
        
        if (endDate) {
          endDateObj = new Date(endDate as string);
        }
      }

      const filters = {
        startDate: startDateObj,
        endDate: endDateObj,
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
