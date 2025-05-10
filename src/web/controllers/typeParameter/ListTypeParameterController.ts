import { NextFunction, Request } from "express";
import { ListTypeParameterUseCase } from "../../../application/use-cases/typeParameter/ListTypeParameterUsecase";

export class ListTypeParameterController {
    constructor(private listTypeParameterUseCase: ListTypeParameterUseCase) {}

    async handle(request: Request, response, next: NextFunction): Promise<void> {
        try {
            const typeParameters = await this.listTypeParameterUseCase.execute();

            return response.sendSuccess(typeParameters, 200);
        } catch (error) {
            next(error);
        }
    }
}