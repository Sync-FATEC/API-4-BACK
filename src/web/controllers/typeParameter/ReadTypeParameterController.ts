import {Request, Response} from 'express';
import { ReadTypeParameterUseCase } from '../../../application/use-cases/typeParameter/ReadTypeParameterUseCase';

export class ReadTypeParameterController {
    constructor (private readTypeParameterUseCase: ReadTypeParameterUseCase) {}

    async handle(request: Request, response): Promise<Response> {
        const { id } = request.params;

        try {
            const typeParameter = await this.readTypeParameterUseCase.execute(id);

            return response.sendSuccess(typeParameter, 200);
        } catch (error) {
            return response.sendError(
                error instanceof Error ? error.message : 'Erro inesperado',
                400
            );
        }
    }
}