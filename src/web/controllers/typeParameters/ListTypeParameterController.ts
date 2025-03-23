import { ListTypeParameterUseCase } from "../../../application/use-cases/typeParameter/ListTypeParameterUsecase";

export class ListTypeParameterController {
    constructor(private listTypeParameterUseCase: ListTypeParameterUseCase) {}

    async handle(request, response) {
        try {
            const typeParameters = await this.listTypeParameterUseCase.execute();

            return response.sendSuccess(typeParameters, 200);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
}