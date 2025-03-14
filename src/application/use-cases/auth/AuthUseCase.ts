import { User, IUserRepository } from '../../../domain/models/entities/User';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

export class AuthUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(email: string, password: string): Promise<{ user: Partial<User>; token: string }> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new Error('User not found');
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new Error('Invalid password');
        }

        const token = sign(
            { name: user.email,
            role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        console.log(token);
        

        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token
        };
    }
} 