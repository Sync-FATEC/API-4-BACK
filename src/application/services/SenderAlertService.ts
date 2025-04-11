import { Criticality } from "../../domain/enums/TypeAlert/Criticality";
import { IEmailSender } from "../../domain/interfaces/IEmailSender";
import { INotificationService } from "../../domain/interfaces/INotificationService";
import { ISenderAlertService } from "../../domain/interfaces/ISenderAlertService";
import { IEmailStationRepository } from "../../domain/interfaces/repositories/IEmailStationRepository";
import { Alert } from "../../domain/models/agregates/Alert/Alert";
import { TypeAlert } from "../../domain/models/agregates/Alert/TypeAlert";
import { Measure } from "../../domain/models/entities/Measure";

export class SenderAlertService implements ISenderAlertService {
  private notificationService: INotificationService;
  private emailSender: IEmailSender;
  private emailStationRepository: IEmailStationRepository;

  constructor(
    notificationService: INotificationService,
    emailSender: IEmailSender,
    emailStationRepository: IEmailStationRepository
  ) {
    this.notificationService = notificationService;
    this.emailSender = emailSender;
    this.emailStationRepository = emailStationRepository;
  }

  async execute(
    alert: Alert,
    typeAlert: TypeAlert,
    measure: Measure
  ): Promise<void> {
    // Obter todos os emails associados à estação do parâmetro do tipo de alerta
    const emailStations = await this.emailStationRepository.getEmails(
      typeAlert.parameter.idStation.id
    );
    
    // Extrair apenas os endereços de email
    const emails = emailStations.map((emailStation) => emailStation.email);
    
    let messageData = {
      alertId: alert.id,
      alertName: alert.type.name,
      value: measure.value,
    }

    // Enviar notificação
    this.notificationService.sendNotification(this.getMessage(typeAlert.criticality), messageData);
    
    // Enviar email para cada destinatário
    const subject = this.getMessage(typeAlert.criticality);
    const text = `Alerta para a estação ${typeAlert.parameter.idStation.name}`;
    
    // Enviar email para cada destinatário individualmente
    for (const email of emails) {
      await this.emailSender.sendEmail(email, subject, text);
    }
  }

  private getMessage(criticality: Criticality) {
    switch (criticality) {
      case Criticality.LOW:
        return "Alerta de baixa criticalidade";
      case Criticality.MEDIUM:
        return "Alerta de média criticalidade";
      case Criticality.HIGH:
        return "Alerta de alta criticalidade";
      case Criticality.CRITICAL:
        return "ALERTA CRÍTICO";
    }
  }
}
