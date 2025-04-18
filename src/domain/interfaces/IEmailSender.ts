import { AlertNotificationData } from "../../application/services/SenderAlertService";

export interface IEmailSender {
    sendEmail(to: string, subject: string, text: string, html?: string): Promise<void>;
    sendAlertEmail(to: string, data: AlertNotificationData, message: string): Promise<void>;
    createPassword(to: string, name: string, email: string): Promise<void>;
} 