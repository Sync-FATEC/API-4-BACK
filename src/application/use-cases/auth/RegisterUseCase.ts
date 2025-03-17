
import { User, IUserRepository } from '../../../domain/models/entities/User';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { isValidCPF } from '../../operations/isValidCPF';
import RegisterUserDTO from '../../../web/dtos/auth/RegisterUserDTO';

export class RegisterUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(userData: RegisterUserDTO): Promise<{ user: Partial<User>; token: string }> {
        const userExists = await this.userRepository.findByEmail(userData.getEmail());
        const cpfExists = await this.userRepository.findByCpf(userData.getCpf());

        if (userExists) {
            throw new Error('Usuário já existe');
        }

        if (isValidCPF(userData.getCpf()) === false) {
            throw new Error('CPF inválido');
        }

        if (cpfExists) {
            throw new Error('CPF já cadastrado');
        }

        const hashedPassword = await hash(userData.getPassword(), 8);

        const user = await this.userRepository.create({
            name: userData.getName(),
            email: userData.getEmail(),
            password: hashedPassword,
            cpf: userData.getCpf(),
            role: 'user'
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