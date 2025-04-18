import { ISenderAlertService } from "../../../domain/interfaces/ISenderAlertService";
import { IAlertRepository } from "../../../domain/interfaces/repositories/IAlertRepository";
import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { IMongoDbRepository } from "../../../domain/interfaces/repositories/IMongoDbRepostory";
import { IParameterRepository } from "../../../domain/interfaces/repositories/IParameterRepository";
import { IStationRepository } from "../../../domain/interfaces/repositories/IStationRepository";
import { ITypeAlertRepository } from "../../../domain/interfaces/repositories/ITypeAlertRepository";
import ReceiverJsonUseCase from "./receiverJsonUseCase";

export class ReceiverMongoJsonUseCase {
    constructor(
        private mongoDbRepository: IMongoDbRepository<any>,
        private stationRepository: IStationRepository,
        private alertRepository: IAlertRepository,
        private typeAlertRepository: ITypeAlertRepository,
        private measureRepository: IMeasureRepository,
        private parameterRepository: IParameterRepository,
        private senderAlertService: ISenderAlertService
    ) {}

    async execute() {
        const receiverJsonUseCase = new ReceiverJsonUseCase(
            this.stationRepository,
            this.alertRepository,
            this.typeAlertRepository,
            this.measureRepository,
            this.parameterRepository,
            this.senderAlertService
        );

        const allJson = await this.mongoDbRepository.findAll();

        for (const json of allJson) {
            await receiverJsonUseCase.execute(json);
            await this.mongoDbRepository.deleteById(json._id);
        }
    }
}