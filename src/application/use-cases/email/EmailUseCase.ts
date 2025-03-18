import { IEmailSender } from '../../../domain/interfaces/IEmailSender';

export class EmailUseCase {
    private static instance: EmailUseCase;
    private emailSender: IEmailSender;

    constructor(emailSender: IEmailSender) {
        this.emailSender = emailSender;
    }

    public static getInstance(emailSender: IEmailSender): EmailUseCase {
        if (!EmailUseCase.instance) {
            EmailUseCase.instance = new EmailUseCase(emailSender);
        }
        return EmailUseCase.instance;
    }

    async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
        await this.emailSender.sendEmail(to, subject, text, html);
    }

    async sendEmailToCreatePassword(to: string, name: string, email: string): Promise<void> {
        await this.emailSender.createPassword(to, name, email);
    }
}
