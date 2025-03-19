import { IUserRepository } from "../../../domain/models/entities/User";

export class DeleteUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(id: string): Promise<boolean> {
        if (this.userRepository.findById(id) === null) {
            throw new Error('Usuário não encontrado ou inexistente');
        }
        return await this.userRepository.delete(id);
    }
}
