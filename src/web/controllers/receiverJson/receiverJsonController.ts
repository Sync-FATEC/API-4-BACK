import { NextFunction, Request } from "express";
import ReceiverJsonUseCase from "../../../application/use-cases/receiverJson/receiverJsonUseCase";

export class ReceiverJsonController {
    constructor(private receiverJsonUseCase: ReceiverJsonUseCase) {}

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
}