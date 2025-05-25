import { Repository, LessThan } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { AppDataSource } from '../database/data-source';
import { PasswordReset } from '../../domain/models/entities/PasswordReset';
import { User } from '../../domain/models/entities/User';
import { SystemContextException } from '../../domain/exceptions/SystemContextException';

export class PasswordResetRepository {
    private repository: Repository<PasswordReset>;

    constructor() {
        this.repository = AppDataSource.getRepository(PasswordReset);
    }

    async createToken(email: string): Promise<string> {
        // Remover tokens existentes para este email
        await this.repository.delete({ email });

        // Criar token JWT específico para redefinição de senha
        const token = sign(
            { email, purpose: 'password-reset' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        // Calcular data de expiração (1 hora no futuro)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        // Salvar no banco de dados
        await this.repository.save({
            email,
            token,
            expiresAt
        });

        return token;
    }

    async findValidToken(token: string): Promise<PasswordReset | null> {
        const passwordReset = await this.repository.findOne({ where: { token } });
        
        if (!passwordReset) {
            return null;
        }

        // Verificar se o token expirou
        if (passwordReset.expiresAt < new Date()) {
            // Remover token expirado
            await this.repository.delete({ token });
            return null;
        }

        return passwordReset;
    }

    async deleteToken(token: string): Promise<void> {
        await this.repository.delete({ token });
    }

    async cleanupExpiredTokens(): Promise<void> {
        await this.repository.delete({
            expiresAt: LessThan(new Date())
        });
    }
}