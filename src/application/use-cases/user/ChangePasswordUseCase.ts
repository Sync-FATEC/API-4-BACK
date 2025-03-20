import { compare } from "bcryptjs";
import { IUserRepository } from "../../../domain/models/entities/User";
import { ChangePasswordDTO } from "../../../web/dtos/user/ChangePasswordDTO";
import hashPassword from "../../operations/auth/hashPassword";

export default class ChangePasswordUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(userData: ChangePasswordDTO): Promise<void> {
        const user = await this.userRepository.findByEmail(userData.getEmail());
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const passwordMatch = await compare(userData.getOldPassword(), user.password);
        
        if (!passwordMatch) {
            throw new Error('Senha antiga incorreta');
        }

        if (userData.getPassword() !== userData.getPasswordConfirmation()) {
            throw new Error('As senhas não coincidem');
        }

        const newPassword = await hashPassword(userData.getPassword());

        await this.userRepository.update(user.getId(), {
            password: newPassword
        });
    }
}