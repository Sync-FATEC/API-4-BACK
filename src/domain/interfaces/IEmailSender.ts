export interface IEmailSender {
    sendEmail(to: string, subject: string, text: string, html?: string): Promise<void>;
    createPassword(to: string, name: string, email: string): Promise<void>;
} 