import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Criticality } from '../../../domain/enums/TypeAlert/Criticality';

interface AlertEmailTemplateProps {
    userName: string;
    alertType: Criticality;
    message: string;
    details?: string;
    timestamp?: Date;
}

export function alertEmailTemplate({
    userName,
    alertType,
    message,
    details = '',
    timestamp = new Date(),
}: AlertEmailTemplateProps): string {
    const formattedDate = format(timestamp, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR,
    });

    const alertTitles = {
        [Criticality.LOW]: 'Alerta de baixa prioridade',
        [Criticality.MEDIUM]: 'Alerta de prioridade média',
        [Criticality.HIGH]: 'Alerta de alta prioridade',
        [Criticality.CRITICAL]: 'Alerta Crítico',
    };

    const alertColors = {
        [Criticality.LOW]: '#d1e7dd',
        [Criticality.MEDIUM]: '#fff3cd',
        [Criticality.HIGH]: '#f8d7da',
        [Criticality.CRITICAL]: '#f5c6cb',
    };

    return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${alertTitles[alertType]}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    .container {
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                    }
                    .header {
                        background-color: ${alertColors[alertType]};
                        color: white;
                        padding: 10px 20px;
                        border-radius: 5px 5px 0 0;
                        margin-bottom: 20px;
                    }
                    .message {
                        margin-bottom: 20px;
                    }
                    .details {
                        background-color: #f9f9f9;
                        padding: 15px;
                        border-left: 4px solid ${alertColors[alertType]};
                        margin-bottom: 20px;
                        white-space: pre-line;
                    }
                    .footer {
                        font-size: 12px;
                        color: #777;
                        border-top: 1px solid #ddd;
                        padding-top: 15px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>${alertTitles[alertType]}</h2>
                    </div>
                    <p>Olá, ${userName}</p>
                    <div class="message">
                        <p>${message}</p>
                    </div>
                    ${details ? `<div class="details">${details}</div>` : ''}
                    <div class="footer">
                        <p>Esta notificação foi enviada em ${formattedDate}</p>
                        <p>Este é um email automático, por favor não responda.</p>
                    </div>
                </div>
            </body>
        </html>
    `;
}