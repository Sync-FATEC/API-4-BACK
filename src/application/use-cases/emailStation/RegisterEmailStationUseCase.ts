import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { IEmailStationRepository } from "../../../domain/interfaces/repositories/IEmailStationRepository";
import { IStationRepository } from "../../../domain/interfaces/repositories/IStationRepository";
import { EmailStation } from "../../../domain/models/entities/EmailsStation";

export class RegisterEmailStationUseCase {

  constructor(private emailStationRepository: IEmailStationRepository, private stationRepository: IStationRepository) {
  }

  public async execute(email: string, stationId: string ) {
    
    let station = await this.stationRepository.findById(stationId);

    if(station == null)
        throw new SystemContextException("Estação não encontrada")
   
    let emailStation = new EmailStation(email, station)

    this.emailStationRepository.createEmailStation(emailStation);
  }
}
