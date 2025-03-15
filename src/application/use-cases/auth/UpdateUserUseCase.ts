import { hash } from "bcryptjs";
import { IUserRepository, User } from "../../../domain/entities/User";
import { UpdateUserDTO } from "../../../web/dtos/auth/UpdateUserDTO";
import { isValidCPF } from "../../operations/isValidCPF";

export class UpdateUserUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(userData: UpdateUserDTO): Promise<User | null> {
        const User = await this.userRepository.findById(userData.getId());
        if (!User) throw new Error('Usuário não encontrado');

        if (userData.getName() != '') {
            User.name = userData.getName();
        }

        if (userData.getEmail() != User.email && userData.getEmail() != '') {
            const emailExists = await this.userRepository.findByEmail(userData.getEmail());
            if (emailExists) throw new Error('Email já cadastrado');
        }

        User.email = userData.getEmail();

        if (userData.getCpf() != User.cpf && userData.getCpf() != '') {
            const cpfExists = await this.userRepository.findByCpf(userData.getCpf());
            if (cpfExists) throw new Error('CPF já cadastrado');
        }

        if (isValidCPF(userData.getCpf()) === false && userData.getCpf() != '') {
            throw new Error('CPF inválido');
        }

        if (userData.getCpf() != '') {
            User.cpf = userData.getCpf();
        }
        

        if (userData.getPassword() != '' && userData.getPassword() != null) {
            const hashedPassword = await hash(userData.getPassword(), 8);
            User.password = hashedPassword;
        }

        return await this.userRepository.update(userData.getId(), User);
    }
}