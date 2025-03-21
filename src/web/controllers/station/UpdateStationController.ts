import { Request, Response } from "express";
import UpdateStationUseCase from "../../../application/use-cases/station/UpdateStationUseCase";
import UpdateStationDTO from "../../dtos/station/UpdateStationDTO";

export class UpdateStationController {
    constructor(private updateStationUseCase: UpdateStationUseCase) {}

    async handle(request: Request, response): Promise<Response> {
        const { id, name, uuid, latitude, longitude } = request.body;

        if (!id || !name || !uuid || !latitude || !longitude) {
            return response.sendError('Dados incompletos', 400);
        }

        const stationData: UpdateStationDTO = new UpdateStationDTO(id, uuid, name, latitude, longitude);
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