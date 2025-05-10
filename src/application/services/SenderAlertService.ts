import { Criticality } from "../../domain/enums/TypeAlert/Criticality";
import { IEmailSender } from "../../domain/interfaces/IEmailSender";
import { INotificationService } from "../../domain/interfaces/INotificationService";
import { ISenderAlertService } from "../../domain/interfaces/ISenderAlertService";
import { IEmailStationRepository } from "../../domain/interfaces/repositories/IEmailStationRepository";
import { Alert } from "../../domain/models/agregates/Alert/Alert";
import { TypeAlert } from "../../domain/models/agregates/Alert/TypeAlert";
import { Measure } from "../../domain/models/entities/Measure";
import { IUserRepository } from "../../domain/models/entities/User";

export type AlertNotificationData = {
  stationId: any;
  alertId: string;
  alertName: string;
  value: number;
  stationName: string;
  parameterName?: string;
  measureTime?: Date;
  criticality?: string;
  unixTime?: number;
  unit?: string;
}

export class SenderAlertService implements ISenderAlertService {
  private notificationService: INotificationService;
  private emailSender: IEmailSender;
  private emailStationRepository: IEmailStationRepository;
  private userRepository: IUserRepository;

  constructor(
    notificationService: INotificationService,
    emailSender: IEmailSender,
    emailStationRepository: IEmailStationRepository,
    userRepository: IUserRepository
  ) {
    this.notificationService = notificationService;
    this.emailSender = emailSender;
    this.emailStationRepository = emailStationRepository;
    this.userRepository = userRepository;

  }

  async execute(
    alert: Alert,
    typeAlert: TypeAlert,
    measure: Measure
  ): Promise<void> {
    // Verificar se typeAlert.parameter e typeAlert.parameter.idStation existem
    if (!typeAlert?.parameter?.idStation?.id) {
      console.error("Erro: O alerta não possui parâmetro ou estação associados");
      return;
    }

    // Obter todos os emails associados à estação do parâmetro do tipo de alerta
    const emailStations = await this.emailStationRepository.getEmails(
      typeAlert.parameter.idStation.id
    );

    const emailAdmin = await this.userRepository.list();

    // Extrair apenas os endereços de email
    const emails = emailStations.map((emailStation) => emailStation.email);
    const emailsAdmin = emailAdmin.map((user) => user.email);

    const emailsToSend = [...emails, ...emailsAdmin];

    const stationName = measure?.parameter?.idStation?.name || "Estação desconhecida";
    const parameterName = measure?.parameter?.idTypeParameter?.name || "Parâmetro desconhecido";
    const measureDate = measure?.unixTime ? new Date(measure.unixTime * 1000) : new Date();
    const criticalityText = this.getMessage(typeAlert.criticality);
    const unit = measure?.parameter?.idTypeParameter?.unit || "";

    let messageData = {
      alertId: alert.id,
      alertName: alert.type.name,
      value: measure.value,
      stationName: stationName,
      parameterName: parameterName,
      measureTime: measureDate,
      criticality: criticalityText,
      unixTime: measure.unixTime,
      unit: unit,
      stationId: typeAlert.parameter.idStation.id
    }

    // Enviar notificação
    this.notificationService.sendNotification(criticalityText, messageData);
    
    const subject = criticalityText;
    
    // Enviar email para cada destinatário individualmente
    for (const email of emailsToSend) {
      await this.emailSender.sendAlertEmail(email, messageData, subject);
    }
  }

  private getMessage(criticality: Criticality): string {
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
