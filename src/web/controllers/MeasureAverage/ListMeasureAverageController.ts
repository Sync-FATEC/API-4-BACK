import { Request, Response, NextFunction } from "express";
import ListMeasureAverageUseCase from "../../../application/use-cases/measureAverage/ListMeasureAverageUseCase";

export class ListMeasureAverageController {
    constructor(private listMeasureAverageUseCase: ListMeasureAverageUseCase) {}

    async handle(request: Request, response: Response, next: NextFunction) {
        try {
            const stationId = request.params.stationId;

            const measures = await this.listMeasureAverageUseCase.execute(stationId);
    
            return response.sendSuccess(measures, 200); 
        } catch (error) {
            next(error);
        }
    }

    async handleWithStartAndEnd(request: Request, response: Response, next: NextFunction) {
        try {
            const stationId = request.params.stationId;
            const start = request.params.start;
            const end = request.params.end;

            const measures = await this.listMeasureAverageUseCase.executeWithStartAndEnd(stationId, start, end);

            return response.sendSuccess(measures, 200);
        } catch (error) {
            next(error);
        }
    }

    async handleWithDate(request: Request, response: Response, next: NextFunction) {
        try {
            const stationId = request.params.stationId;
            const date = request.params.date;
            const measures = await this.listMeasureAverageUseCase.executeWithDate(stationId, date);

            return response.sendSuccess(measures, 200);
        } catch (error) {
            next(error);
        }
    }
}
