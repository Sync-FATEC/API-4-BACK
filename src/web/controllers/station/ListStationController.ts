import { NextFunction } from "express";
import { ListStationUseCase } from "../../../application/use-cases/station/ListStationUseCase";

export class ListStationController {
    constructor(private listStationUseCase: ListStationUseCase) { }

    async handle(request, response, next: NextFunction) {
        try {
            const stations = await this.listStationUseCase.execute();

            return response.sendSuccess(stations, 200);
        } catch (error) {
            next(error)
        }
    }
}