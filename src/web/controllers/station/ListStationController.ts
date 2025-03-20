import { ListStationUseCase } from "../../../application/use-cases/station/ListStationUseCase";

export class ListStationController {
    constructor(private listStationUseCase: ListStationUseCase) { }

    async handle(request, response) {
        try {
            const stations = await this.listStationUseCase.execute();

            return response.sendSuccess(stations, 200);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
}