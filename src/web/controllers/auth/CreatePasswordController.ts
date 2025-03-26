import CreatePasswordUseCase from "../../../application/use-cases/auth/CreatePasswordUseCase";
import { NextFunction, Request } from "express";

export default class CreatePasswordController {
    constructor(private createPasswordUseCase: CreatePasswordUseCase) {}

    async handle(request: Request, response, next: NextFunction): Promise<Response> {
        try {
            const { email, password } = request.body;

            if (!email || !password) {
                return response.sendError('Email ou senha não informados', 400);
            }

            await this.createPasswordUseCase.execute(email, password);

            return response.sendSuccess('Senha criada com sucesso', 200);
        } catch (error) {
            next(error);
        }
    }
}