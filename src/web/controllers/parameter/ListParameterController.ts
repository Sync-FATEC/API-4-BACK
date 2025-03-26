import { NextFunction, Request } from "express";
import { ListParameterUseCase } from "../../../application/use-cases/parameter/ListParameterUseCase";

export class ListParameterController {
    constructor(private listParameterUseCase: ListParameterUseCase) {}

    async handle(request: Request, response, next: NextFunction) {
        try {
            const parameters = await this.listParameterUseCase.execute();

            return response.sendSuccess(parameters, 200);
        } catch (error) {
            next(error)
        }
    }
}