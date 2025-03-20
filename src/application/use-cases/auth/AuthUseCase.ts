import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { IUserRepository, User } from '../../../domain/models/entities/User';
import { sendEmailCreatePassword } from '../../operations/email/sendEmailCreatePassword';
export class AuthUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(email: string, password: string | null): Promise<{ user: Partial<User>; token: string }> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new Error('Usuario não encontrado');
        }

        if (!user.password || !password) {
            await this.verifyUserHavePassword(email, user.name);
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new Error('Senha incorreta');
        }

        const token = sign(
            { name: user.email,
            role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token
        };
    }

    private async verifyUserHavePassword(userEmail: string, userName: string) {
        const user = await this.userRepository.findByEmail(userEmail);

        if (!user.password) {
            sendEmailCreatePassword(userEmail, userName)
            throw new Error('Usuário não possui senha ainda, verifique seu email');
        }
    }
} 