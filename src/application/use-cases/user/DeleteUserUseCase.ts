import { IUserRepository } from "../../../domain/models/entities/User";

export class DeleteUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(id: string): Promise<boolean> {
        const user = await this.userRepository.findById(id);

        if (user === null) {
            throw new Error('Usuário não encontrado ou inexistente');
        }
        
        if (user.email === 'admin@admin.com') {
            throw new Error('Não é possível deletar o usuário admin');
        }

        return await this.userRepository.delete(id);
    }
}
