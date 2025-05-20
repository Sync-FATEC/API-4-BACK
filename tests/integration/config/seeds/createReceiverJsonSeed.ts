import emailSender from "../../../../src/application/operations/email/sendEmailCreatePassword";
import { SenderAlertService } from "../../../../src/application/services/SenderAlertService";
import ReceiverJsonUseCase from "../../../../src/application/use-cases/receiverJson/receiverJsonUseCase";
import { AlertRepository } from "../../../../src/infrastructure/repositories/AlertRepository"
import { EmailStationRepository } from "../../../../src/infrastructure/repositories/EmailStationRepository";
import { MeasureRepository } from "../../../../src/infrastructure/repositories/MeasureRepository";
import { ParameterRepository } from "../../../../src/infrastructure/repositories/ParameterRepository";
import StationRepository from "../../../../src/infrastructure/repositories/StationRepository"
import TypeAlertRepository from "../../../../src/infrastructure/repositories/TypeAlertRepository";
import { UserRepository } from "../../../../src/infrastructure/repositories/UserRepository";
import { getNotificationService } from "../../../../src/infrastructure/websocket/socket";

export const createReceiverJsonSeed = async (data: any) => {
    const measureRepository = new MeasureRepository();
    const stationRepository = new StationRepository();
    const alertRepository = new AlertRepository();
    const typeAlertRepository = new TypeAlertRepository();
    const parameterRepository = new ParameterRepository();
    const notificationService = getNotificationService();
    const emailStationRepository = new EmailStationRepository();
    const userRepository = new UserRepository();

    const senderAlert = new SenderAlertService(
        notificationService,
        emailSender,
        emailStationRepository,
        userRepository
    );

    const useCase = new ReceiverJsonUseCase(stationRepository, alertRepository, typeAlertRepository, measureRepository, parameterRepository, senderAlert)

    return useCase.execute(data)

}
