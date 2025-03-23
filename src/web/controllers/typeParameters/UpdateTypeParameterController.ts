import { Request, Response } from 'express';


import UpdateTypeParameterUseCase from '../../../application/use-cases/typeParameter/UpdateTypeParameterUseCase';
import UpdateTypeParameterDTO from '../../dtos/typeParameters/UpdateTypeParameterDTO';

export class UpdateTypeParameterController {
    constructor(private updateTypeParameterUseCase: UpdateTypeParameterUseCase) {}

    async handle(request: Request, response): Promise<Response> {
        const { id, name, unit, numberOfDecimalsCases, factor, offset, typeJson } = request.body;

        if (!id || !name || !unit || !numberOfDecimalsCases || !factor || !offset || !typeJson) {
            return response.sendError('Dados incompletos', 400);
        }

        const typeParameterData: UpdateTypeParameterDTO = new UpdateTypeParameterDTO(id, name, unit, numberOfDecimalsCases, factor, offset, typeJson);
        try {
            await this.updateTypeParameterUseCase.execute(typeParameterData);

            return response.sendSuccess({}, 200);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
}