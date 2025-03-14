<<<<<<< Updated upstream
import 'dotenv/config';
import { User, IUserRepository } from '../../../domain/entities/User';
=======
import { User, IUserRepository } from '../../../domain/models/entities/User';
>>>>>>> Stashed changes
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { isValidCPF } from '../../operations/isValidCPF';

interface RegisterUserRequest {
    name: string;
    email: string;
    password: string;
    cpf: string;
    role?: string;
}

export class RegisterUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute({ name, email, password, cpf, role }: RegisterUserRequest): Promise<{ user: Partial<User>; token: string }> {
        const userExists = await this.userRepository.findByEmail(email);
        const cpfExists = await this.userRepository.findByCpf(cpf);

        if (userExists) {
            throw new Error('Usuário já existe');
        }

        if (isValidCPF(cpf) === false) {
            throw new Error('CPF inválido');
        }

        if (cpfExists) {
            throw new Error('CPF já cadastrado');
        }

        const hashedPassword = await hash(password, 8);

        const user = await this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            cpf,
            role
        });

        const token = sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d'}
        );

        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token
        };
    }
} 