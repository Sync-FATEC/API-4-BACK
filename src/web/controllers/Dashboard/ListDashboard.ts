import { Request, Response } from 'express';
import { ListDashboardUseCase } from '../../../application/use-cases/dashboard/ListDashboardUseCase';

export class ListDashboardController {
  constructor(private listDashboardUseCase: ListDashboardUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { 
        startDate, 
        endDate, 
        stationId, 
        parameterId 
      } = request.query;

      // Convert query string parameters to appropriate types
      const filters = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        stationId: stationId ? String(stationId) : undefined,
        parameterId: parameterId ? String(parameterId) : undefined
      };

      const dashboardData = await this.listDashboardUseCase.execute(filters);

      return response.status(200).json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      return response.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro inesperado'
      });
    }
  }
}
