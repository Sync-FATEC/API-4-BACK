import { UpdateUserDTO } from "../../../web/dtos/auth/UpdateUserDTO";
import { isValidCPF } from "../../operations/isValidCPF";
import { transformUserToDTO } from "../../operations/user/transformeUserToDTO";
import { IUserRepository, User } from "../../../domain/models/entities/User";
import { ReadUserDTO } from "../../../web/dtos/user/ReadUserDTO";
import { SystemContextException } from "../../../domain/exceptions/SystemContextException";

export class UpdateUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(userData: UpdateUserDTO): Promise<ReadUserDTO | null> {        
        const user = await this.userRepository.findById(userData.getId());
        if (!user) throw new SystemContextException('Usuário não encontrado');

        const updateData: Partial<User> = {};

        if (userData.getName()) {
            updateData.name = userData.getName();
        }

        if (userData.getEmail() && userData.getEmail() !== user.email) {
            const emailExists = await this.userRepository.findByEmail(userData.getEmail());
            if (emailExists) {
                throw new SystemContextException('Email já cadastrado');
            }
            updateData.email = userData.getEmail();
        }

        if (userData.getCpf() && userData.getCpf() !== user.cpf) {
            const cpfExists = await this.userRepository.findByCpf(userData.getCpf());
            if (cpfExists) {
                throw new SystemContextException('CPF já cadastrado');
            }
            if (!isValidCPF(userData.getCpf())) {
                throw new SystemContextException('CPF inválido');
            }
            updateData.cpf = userData.getCpf();
        }
        
        const updatedUser = await this.userRepository.update(userData.getId(), updateData);
        return transformUserToDTO(updatedUser);
    }
}