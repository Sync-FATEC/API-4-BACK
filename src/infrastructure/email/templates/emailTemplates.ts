export const emailTemplates = {
    createPassword: (name: string, email: string) => ({
        subject: 'Bem-vindo ao nosso sistema!',
        text: `Olá ${name},\n\nBem-vindo ao nosso sistema! Estamos muito felizes em ter você conosco.\n\nAtenciosamente,\nEquipe Sync`,
        html: `
            <h1>Bem-vindo ao nosso sistema!</h1>
            <p>Olá ${name},</p>
            <p>Bem-vindo ao nosso sistema! Estamos muito felizes em ter você conosco.</p>
            <p>Mas ainda falta você criar sua senha. Clique no link abaixo para criar sua senha:</p>
            <a href="http://localhost:3000/criar-senha?email=${email}">Criar senha</a>
            <p>Atenciosamente,<br>Equipe Sync</p>
        `
    })
}; 