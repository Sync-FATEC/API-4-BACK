import { NodemailerEmailSender } from "../../../infrastructure/email/nodeMailerEmailSender";
import { EmailUseCase } from "../../use-cases/email/EmailUseCase";

export function sendEmailCreatePassword(email: string, name: string) {
    const emailSender = NodemailerEmailSender.getInstance();
    const emailUseCase = new EmailUseCase(emailSender);

    emailUseCase.sendEmailToCreatePassword(email, name, email);
}