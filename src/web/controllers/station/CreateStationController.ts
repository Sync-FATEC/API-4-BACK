import { Request } from "express";
import CreateStationDTO from "../../../../src/web/dtos/station/CreateStationDTO";
import { CreateStationUseCase } from "../../../application/use-cases/station/CreateStationUseCase";

export default class CreateStationController {
  constructor(private createStationUseCase: CreateStationUseCase) {}

  async handle(request: Request, response) {
    const { uuid, name, latitude, longitude } = request.body;

    if (!uuid || !name || !latitude || !longitude) {
      return response.sendError("Dados incompletos", 400);
    }

    const StationData: CreateStationDTO = new CreateStationDTO(name, uuid, latitude, longitude);

    try {
      const station = await this.createStationUseCase.execute(StationData);

      return response.sendSuccess(station, 200);
    } catch (error) {
      return response.sendError(
        error instanceof Error ? error.message : "Erro inesperado"
      );
    }
  }
}
