import { ITypeAlertRepository } from "../../../domain/interfaces/repositories/ITypeAlertRepository";
import { TypeAlertUseCase } from "./TypeAlertUseCase";

export class ListTypeAlertUseCase extends TypeAlertUseCase {

    constructor(typeAlertRepository: ITypeAlertRepository) {
        super(null, typeAlertRepository);
    }

    async execute() {
        const typeAlerts = await this.typeAlertRepository.findAll();
        return typeAlerts;
    }
}