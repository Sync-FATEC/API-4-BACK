import { ITypeAlertRepository } from "../../../domain/interfaces/repositories/ITypeAlertRepository";
import { TypeAlert } from "../../../domain/models/agregates/Alert/TypeAlert";
import { TypeAlertUseCase } from "./TypeAlertUseCase";


export class ReadTypeAlertUseCase extends TypeAlertUseCase {

    constructor(typeAlertRepository: ITypeAlertRepository) {
        super(null, typeAlertRepository);
    }

    async execute(id: string): Promise<TypeAlert> {
        const typeAlert = await this.typeAlertRepository.findById(id);
        return typeAlert;
    }
}