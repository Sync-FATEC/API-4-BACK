
import { User, IUserRepository } from '../../../domain/models/entities/User';
import { isValidCPF } from '../../operations/isValidCPF';
import RegisterUserDTO from '../../../web/dtos/auth/RegisterUserDTO';
import { ReadUserDTO } from '../../../web/dtos/user/ReadUserDTO';
import { transformUserToDTO } from '../../operations/user/transformeUserToDTO';
import { sendEmailCreatePassword } from '../../operations/email/sendEmailCreatePassword';
import { SystemContextException } from '../../../domain/exceptions/SystemContextException';

export class RegisterUseCase {
    constructor(private userRepository: IUserRepository) {}
    
    async execute(userData: RegisterUserDTO): Promise<ReadUserDTO> {
        const userExists = await this.userRepository.findByEmail(userData.getEmail());
        const cpfExists = await this.userRepository.findByCpf(userData.getCpf());

        if (userExists) {
            throw new SystemContextException('Email já cadastrado');
        }

        if (isValidCPF(userData.getCpf()) === false) {
            throw new SystemContextException('CPF inválido');
        }

        if (cpfExists) {
            throw new SystemContextException('CPF já cadastrado');
        }

        const user = await this.userRepository.create({
            name: userData.getName(),
            email: userData.getEmail(),
            cpf: userData.getCpf(),
            role: userData.getRole(),
            active: false
        });

        sendEmailCreatePassword(user.email, user.name)
        
        return transformUserToDTO(user);
    }
} 