import { NextFunction, Request } from "express";
import ReceiverJsonUseCase from "../../../application/use-cases/receiverJson/receiverJsonUseCase";
import { ReceiverMongoJsonUseCase } from "../../../application/use-cases/receiverJson/receiverMongoUseCase";
export class ReceiverJsonController {
    constructor(private receiverJsonUseCase: ReceiverJsonUseCase,
        private receiverMongoJsonUseCase: ReceiverMongoJsonUseCase
    ) {}

    async handle(request: Request, response, next: NextFunction) {
        try {
            const dataJson = request.body;
            await this.receiverJsonUseCase.execute(dataJson);
            return response.sendSuccess("Dados cadastrados", 200);
        }
        catch (error) {
            next(error);
        }
    }

    async sync(request: Request, response, next: NextFunction) {
        try {
            await this.receiverMongoJsonUseCase.execute();
            return response.sendSuccess("Sincronizado com sucesso", 200);
        }
        catch (error) {
            next(error);
        }
    }
}