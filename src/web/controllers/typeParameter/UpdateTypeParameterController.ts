import { NextFunction, Request, Response } from 'express';


import UpdateTypeParameterUseCase from '../../../application/use-cases/typeParameter/UpdateTypeParameterUseCase';
import UpdateTypeParameterDTO from '../../dtos/typeParameter/UpdateTypeParameterDTO';

export class UpdateTypeParameterController {
    constructor(private updateTypeParameterUseCase: UpdateTypeParameterUseCase) {}

    async handle(request: Request, response, next: NextFunction): Promise<Response> {
        const { id, name, unit, numberOfDecimalsCases, factor, offset, typeJson } = request.body;

        if (!id || !name || !unit || !numberOfDecimalsCases || !factor || !offset || !typeJson) {
            return response.sendError('Dados incompletos', 400);
        }

        const typeParameterData: UpdateTypeParameterDTO = new UpdateTypeParameterDTO(id, name, unit, numberOfDecimalsCases, factor, offset, typeJson);
        try {
            await this.updateTypeParameterUseCase.execute(typeParameterData);

            return response.sendSuccess({}, 200);
        } catch (error) {
            next(error);
        }
    }
}