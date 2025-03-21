import { ITypeAlertRepository } from "../../../domain/interfaces/repositories/ITypeAlertRepository";
import { TypeAlertUseCase } from "./TypeAlertUseCase";

export class DeleteTypeAlertUseCase extends TypeAlertUseCase {

    constructor(typeAlertRepository: ITypeAlertRepository) {
        super(null, typeAlertRepository);
    }

    async execute(id: string): Promise<void> {
        const typeAlert = await this.typeAlertRepository.delete(id);
    }
}