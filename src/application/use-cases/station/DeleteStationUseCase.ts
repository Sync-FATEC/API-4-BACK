import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IStationRepository } from "../../../domain/interfaces/repositories/IStationRepository";

export default class DeleteStationUseCase {
    constructor(private stationRepository: IStationRepository) {}

    async execute(id: string): Promise<any> {
        const station = await this.stationRepository.findById(id);
        if (!station) {
            throw new SystemContextException('Estação não encontrada');
        }

        return await this.stationRepository.delete(id);
    }
}