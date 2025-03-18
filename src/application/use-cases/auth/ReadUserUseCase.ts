import { IUserRepository, User } from "../../../domain/entities/User";

export class ReadUserUseCase {
    constructor(private userRepository: IUserRepository) {}
    
    async execute(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return user;
    }
}