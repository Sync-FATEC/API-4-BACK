import { hash } from "bcryptjs";
import { IUserRepository } from "../../../domain/models/entities/User";

export default class CreatePasswordUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(email: string, password: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);

        if (!user || user.password !== null) {
            throw new Error('Usuário não encontrado ou senha já cadastrada');
        }
        
        const hashedPassword = await hash(password, 8);

        await this.userRepository.update(user.id, { password: hashedPassword });
    }
}