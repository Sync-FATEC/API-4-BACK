import { NextFunction, Request, Response } from "express";
import { ReadStationUseCase } from "../../../application/use-cases/station/ReadStationUseCase";

export class ReadStationController {
    constructor(private readStationUseCase: ReadStationUseCase) {}

    async handle(request: Request, response, next: NextFunction): Promise<Response> {
        const { id } = request.params;

        try {
            const station = await this.readStationUseCase.execute(id);

            return response.sendSuccess(station, 200);
        } catch (error) {
            next(error)
        }
    }
}