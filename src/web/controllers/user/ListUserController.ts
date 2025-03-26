import { ListUserUseCase } from "../../../application/use-cases/user/ListUserUseCase";
import { NextFunction, Request, Response } from 'express';

export class ListUserController {
    constructor(private listUserUseCase: ListUserUseCase) {}

    async handle(request: Request, response, next: NextFunction): Promise<Response> {
        try {
            const users = await this.listUserUseCase.execute();
            
            const usersWithoutPassword = users;

            return response.sendSuccess(usersWithoutPassword, 200);
        } catch (error) {
            next(error);
        }
    }
}