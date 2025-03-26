import { compare } from "bcryptjs";
import { IUserRepository } from "../../../domain/models/entities/User";
import { ChangePasswordDTO } from "../../../web/dtos/user/ChangePasswordDTO";
import hashPassword from "../../operations/auth/hashPassword";
import { SystemContextException } from "../../../domain/exceptions/SystemContextException";

export default class ChangePasswordUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(userData: ChangePasswordDTO): Promise<void> {
        const user = await this.userRepository.findByEmail(userData.getEmail());
        if (!user) {
            throw new SystemContextException('Usuário não encontrado');
        }

        const passwordMatch = await compare(userData.getOldPassword(), user.password);
        
        if (!passwordMatch) {
            throw new SystemContextException('Senha antiga incorreta');
        }

        if (userData.getPassword() !== userData.getPasswordConfirmation()) {
            throw new SystemContextException('As senhas não coincidem');
        }

        const newPassword = await hashPassword(userData.getPassword());

        await this.userRepository.update(user.getId(), {
            password: newPassword
        });
    }
}