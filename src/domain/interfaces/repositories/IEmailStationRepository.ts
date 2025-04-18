import { EmailStation } from "../../models/entities/EmailsStation";

export interface IEmailStationRepository {
  createEmailStation(email: EmailStation): Promise<EmailStation>;
  getEmails(stationId: string): Promise<EmailStation[]>;
}
