import { IUserRepository } from "../../../domain/models/entities/User";
import hashPassword from "../../operations/auth/hashPassword";

export default class CreatePasswordUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(email: string, password: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);

        console.log(email);
        

        if (!user || user.password !== null) {
            throw new Error('Usuário não encontrado ou senha já cadastrada');
        }
        
        const hashedPassword: string = await hashPassword(password);
        
        await this.userRepository.update(user.id, { password: hashedPassword, active: true });
    }
}