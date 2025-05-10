import { SystemContextException } from "../../../domain/exceptions/SystemContextException";
import { NodemailerEmailSender } from "../../../infrastructure/email/nodeMailerEmailSender";
import { EmailUseCase } from "../../use-cases/email/EmailUseCase";

export function sendEmailCreatePassword(email: string, name: string): void {
    try {
        const emailUseCase = new EmailUseCase(emailSender);

        emailUseCase.sendEmailToCreatePassword(email, name, email);
    } catch {
        throw new SystemContextException('Erro ao enviar email');
    }
}

export const emailSender = NodemailerEmailSender.getInstance();
export default emailSender;