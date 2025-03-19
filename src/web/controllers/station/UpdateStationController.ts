import UpdateStationUseCase from "@/application/use-cases/station/UpdateStationUseCase";
import UpdateStationDTO from "@/web/dtos/station/UpdateStationDTO";
import { Request, Response } from "express";

export class UpdateStationController {
    constructor(private updateStationUseCase: UpdateStationUseCase) {}

    async handle(request: Request, response): Promise<Response> {
        const { id, name, latitude, longitude, altitude } = request.body;

        const stationData: UpdateStationDTO = new UpdateStationDTO(id, name, latitude, longitude, altitude);
        try {
            const station = await this.updateStationUseCase.execute(stationData);

            return response.sendSuccess(station, 200);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
}