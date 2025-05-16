import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { PasswordResetRepository } from '../../infrastructure/repositories/PasswordResetRepository';
import { SystemContextException } from '../../domain/exceptions/SystemContextException';
import { NodemailerEmailSender } from '../../infrastructure/email/nodeMailerEmailSender';
import hashPassword from '../operations/auth/hashPassword';
import { verify } from 'jsonwebtoken';
import { emailTemplates } from '../../infrastructure/email/templates/emailTemplates';

export class PasswordResetService {
    private userRepository: UserRepository;
    private passwordResetRepository: PasswordResetRepository;
    private emailSender: NodemailerEmailSender;

    constructor() {
        this.userRepository = new UserRepository();
        this.passwordResetRepository = new PasswordResetRepository();
        this.emailSender = NodemailerEmailSender.getInstance();
    }

    async requestReset(email: string): Promise<void> {
        // Verificar se o usuário existe
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new SystemContextException('Usuário com este email não encontrado');
        }

        // Gerar token de redefinição
        const token = await this.passwordResetRepository.createToken(email);

        // URL com o token para redefinição (frontend)
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;

        // Usar nosso template de email para redefinição de senha
        const template = emailTemplates.resetPassword(
            user.name, 
            email, 
            resetUrl
        );
        
        await this.emailSender.sendEmail(
            email,
            template.subject,
            template.text,
            template.html
        );
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        // Limpar tokens expirados
        await this.passwordResetRepository.cleanupExpiredTokens();

        // Verificar se o token existe e é válido
        const resetToken = await this.passwordResetRepository.findValidToken(token);

        console.log()
        console.log("ResetToken: ", resetToken);
        console.log()
        console.log("Token: ", token)
        console.log()

        if (!resetToken) {
            throw new SystemContextException('Token inválido ou expirado');
        }

        try {
            // Verificar se o token JWT é válido
            const decoded = verify(token, process.env.JWT_SECRET) as { email: string; purpose: string };
            
            if (decoded.purpose !== 'password-reset') {
                throw new SystemContextException('Token inválido');
            }

            const email = decoded.email;

            // Encontrar o usuário
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new SystemContextException('Usuário não encontrado');
            }

            // Hash da nova senha
            const hashedPassword = await hashPassword(newPassword);

            // Atualizar a senha do usuário
            await this.userRepository.update(user.id, {
                password: hashedPassword,
                active: true
            });

            // Remover o token usado
            await this.passwordResetRepository.deleteToken(token);

        } catch (error) {
            if (error instanceof SystemContextException) {
                throw error;
            }
            throw new SystemContextException('Erro ao redefinir senha');
        }
    }

    async validateToken(token: string): Promise<boolean> {
        // Limpar tokens expirados
        await this.passwordResetRepository.cleanupExpiredTokens();

        // Verificar se o token existe e é válido
        const resetToken = await this.passwordResetRepository.findValidToken(token);
        
        console.log()
        console.log("ResetToken: ", resetToken);
        console.log()
        console.log("Token: ", token)
        console.log()

        if (!resetToken) {
            return false;
        }

        try {
            // Verificar se o token JWT é válido
            const decoded = verify(token, process.env.JWT_SECRET) as { email: string; purpose: string };
            
            if (decoded.purpose !== 'password-reset') {
                
                return false;
            }
            return true;

        } catch (error) {
            return false;
        }
    }
}