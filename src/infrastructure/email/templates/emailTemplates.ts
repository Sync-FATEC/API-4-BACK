import { sub } from "date-fns";
import { AlertNotificationData } from "../../../application/services/SenderAlertService";

const link = process.env.FRONTEND_URL;

export const emailTemplates = {
  createPassword: (name: string, email: string) => ({
    subject: "Bem-vindo ao nosso sistema!",
    text: `Olá ${name},\n\nBem-vindo ao nosso sistema! Estamos muito felizes em ter você conosco.\n\nAtenciosamente,\nEquipe Sync`,
    html: `
            <h1>Bem-vindo ao nosso sistema!</h1>
            <p>Olá ${name},</p>
            <p>Bem-vindo ao nosso sistema! Estamos muito felizes em ter você conosco.</p>
            <p>Mas ainda falta você criar sua senha. Clique no link abaixo para criar sua senha:</p>
            <a href="${link}/usuario/criar-senha/${email}">Criar senha</a>
            <p>Atenciosamente,<br>Equipe Sync</p>
        `,
  }),

  alertEmailTemplate: (subject: string, data: AlertNotificationData) => ({
    subject: subject,
    text: `Alerta: ${data.alertName}\n\nValor: ${data.value}\n\n`,
    html: `
            <h1> Atenção ${subject}</h1>
            <h2>Alerta: ${data.alertName}</h2>
            <p>Valor: ${data.value}</p>
        `,
  }),
};
