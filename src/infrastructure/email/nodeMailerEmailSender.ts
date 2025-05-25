import nodemailer from 'nodemailer';
import { emailTemplates } from './templates/emailTemplates';
import { IEmailSender } from '../../domain/interfaces/IEmailSender';
import { SystemContextException } from '../../domain/exceptions/SystemContextException';
import { AlertNotificationData } from '../../application/services/SenderAlertService';

export class NodemailerEmailSender implements IEmailSender {
    private static instance: NodemailerEmailSender;
    private transporter: nodemailer.Transporter;

    private constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }


    async sendAlertEmail(to: string, data: AlertNotificationData, message: string): Promise<void> {
        const template = emailTemplates.alertEmailTemplate(message, data);
        await this.sendEmail(to, template.subject, template.text, template.html);
    }

    public static getInstance(): NodemailerEmailSender {
        if (!NodemailerEmailSender.instance) {
            NodemailerEmailSender.instance = new NodemailerEmailSender();
        }
        return NodemailerEmailSender.instance;
    }

    async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            text,
            html,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Erro ao enviar email:', error);
        }
    }

    async createPassword(to: string, name: string, email: string): Promise<void> {
        const template = emailTemplates.createPassword(name, email);
        await this.sendEmail(to, template.subject, template.text, template.html);
    }
}
