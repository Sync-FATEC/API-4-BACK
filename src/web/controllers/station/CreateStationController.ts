import { Request } from "express";
import CreateStationDTO from "../../../../src/web/dtos/station/CreateStationDTO";
import { CreateStationUseCase } from "../../../application/use-cases/station/CreateStationUseCase";

export default class CreateStationController {
  constructor(private createStationUseCase: CreateStationUseCase) {}

  async handle(request: Request, response) {
    const { name, latitude, longitude, altitude } = request.body;

    const StationData: CreateStationDTO = new CreateStationDTO(name, latitude, longitude, altitude);

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
