import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IEmailStationRepository } from "../../../domain/interfaces/repositories/IEmailStationRepository";
import { IStationRepository } from "../../../domain/interfaces/repositories/IStationRepository";
import { EmailStation } from "../../../domain/models/entities/EmailsStation";

export class RegisterEmailStationUseCase {
  private emailStationRepository: IEmailStationRepository;
  private stationRepository: IStationRepository;

  constructor(emailStationRepository: IEmailStationRepository, stationRepository: IStationRepository) {
    emailStationRepository = emailStationRepository;
    stationRepository = stationRepository;
  }

  public async execute(email: string, stationId: string ) {
    let station = await this.stationRepository.findById(stationId);

    if(station == null)
        throw new SystemContextException("Estação não encontrada")
   
    let emailStation = new EmailStation(email, station)

    this.emailStationRepository.createEmailStation(emailStation);
  }
}
