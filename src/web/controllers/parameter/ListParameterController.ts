import { ListParameterUseCase } from "../../../application/use-cases/parameter/ListParameterUseCase";

export class ListParameterController {
    constructor(private listParameterUseCase: ListParameterUseCase) {}

    async handle(request, response) {
        try {
            const parameters = await this.listParameterUseCase.execute();

            return response.sendSuccess(parameters, 200);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
}