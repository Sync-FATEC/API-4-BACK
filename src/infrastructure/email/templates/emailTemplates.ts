import { AlertNotificationData } from "../../../application/services/SenderAlertService";

const link = process.env.FRONTEND_URL;

export const emailTemplates = {
  createPassword: (name: string, email: string): { subject: string; text: string; html: string } => ({
    subject: "Bem-vindo ao nosso sistema!",
    text: `Olá ${name},\n\nBem-vindo ao nosso sistema! Estamos muito felizes em ter você conosco.\n\nAtenciosamente,\nEquipe Sync`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ccc; border-radius: 5px; max-width: 600px;">
        <div style="background-color: #4CAF50; color: white; padding: 10px 15px; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Bem-vindo ao nosso sistema!</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px;">
          <h2 style="color: #4CAF50; margin-top: 0;">Olá <strong>${name}</strong>,</h2>
          
          <p>Estamos muito felizes em ter você conosco!</p>
          
          <div style="background-color: #f5f5f5; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
            <p style="margin: 0;">Para começar a utilizar nosso sistema, precisamos que você crie sua senha.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}/usuario/criar-senha/${email}" 
               style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block; font-weight: bold;">
              Criar Minha Senha
            </a>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #fff; border: 1px solid #eee; border-radius: 5px;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Seu e-mail:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;"><code style="background-color: #f5f5f5; padding: 3px 6px; border-radius: 3px;">${email}</code></td>
            </tr>
          </table>
          
          <div style="background-color: #fff8e1; border-left: 4px solid #FFB300; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
            <p style="margin: 0; color: #856404;">Se você não solicitou este cadastro, por favor ignore este e-mail.</p>
          </div>
          
          <p style="margin-top: 40px; font-size: 14px; color: #777; border-top: 1px solid #ddd; padding-top: 20px;">Atenciosamente,<br><strong>Equipe Sync</strong></p>
        </div>
      </div>
    `,
  }),

  alertEmailTemplate: (subject: string, data: AlertNotificationData): { subject: string; text: string; html: string } => {
    // Formatar data para exibição
    const dateTime = data.measureTime ? 
      new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Sao_Paulo'
      }).format(data.measureTime) : 'Data não disponível';
      
    // Determinar a cor com base na criticidade
    let colorAlert = "#f44336"; // Vermelho padrão
    if (data.criticality?.includes("baixa")) {
      colorAlert = "#FFC107"; // Amarelo para baixa
    } else if (data.criticality?.includes("média")) {
      colorAlert = "#FF9800"; // Laranja para média
    } else if (data.criticality?.includes("alta")) {
      colorAlert = "#F44336"; // Vermelho para alta
    } else if (data.criticality?.includes("CRÍTICO")) {
      colorAlert = "#9C27B0"; // Roxo para crítico
    }
    
    const formattedValue = `${data.value}${data.unit ? ' ' + data.unit : ''}`;
    
    return {
      subject: subject,
      text: `${subject}\n\nAlerta: ${data.alertName}\nEstação: ${data.stationName}\nParâmetro: ${data.parameterName || 'Não especificado'}\nValor: ${formattedValue}\nData/Hora: ${dateTime}\n\n`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ccc; border-radius: 5px; max-width: 600px;">
          <div style="background-color: ${colorAlert}; color: white; padding: 10px 15px; border-radius: 5px 5px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">${subject}</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px;">
            <h2 style="color: ${colorAlert}; margin-top: 0;">Alerta: ${data.alertName}</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 150px;">Estação:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.stationName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Parâmetro:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.parameterName || 'Não especificado'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Valor:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; font-size: 18px; color: ${colorAlert};">${formattedValue}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Data/Hora:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${dateTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Criticidade:</td>
                <td style="padding: 8px;"><span style="color: ${colorAlert}; font-weight: bold;">${data.criticality || 'Não especificada'}</span></td>
              </tr>
            </table>
            
            <div style="background-color: #f5f5f5; border-left: 4px solid ${colorAlert}; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
              <p style="margin: 0; font-style: italic;">Este alerta requer sua atenção. Por favor, verifique o sistema para mais detalhes e tome as medidas necessárias.</p>
            </div>
            
            <p style="margin-top: 30px;">Acesse o <a href="${link}/estacao/${data.stationId}" style="color: ${colorAlert}; font-weight: bold; text-decoration: none;">painel de controle</a> para mais detalhes e ações.</p>
            
            <p style="margin-top: 40px; font-size: 14px; color: #777; border-top: 1px solid #ddd; padding-top: 20px;">Atenciosamente,<br><strong>Equipe Sync</strong></p>
          </div>
        </div>
      `,
    };
  },
  
};