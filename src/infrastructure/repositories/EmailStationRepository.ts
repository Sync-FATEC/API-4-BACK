import { Repository } from "typeorm";
import { IEmailStationRepository } from "../../domain/interfaces/repositories/IEmailStationRepository";
import { EmailStation } from "../../domain/models/entities/EmailsStation";
import { AppDataSource } from "../database/data-source";

export class EmailStationRepository implements IEmailStationRepository {
    private emailStations: Repository<EmailStation> = AppDataSource.getRepository(EmailStation);

    constructor() {
        this.emailStations = AppDataSource.getRepository(EmailStation); 
    }

    createEmailStation(email: EmailStation): Promise<EmailStation> {
        return this.emailStations.save(email);
    }
    getEmails(stationId: string): Promise<EmailStation[]> {
        return this.emailStations.find({
            where: {
                station: {
                    id: stationId
                }
            }
        });
    }
}
