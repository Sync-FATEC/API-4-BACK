import { IUserRepository } from "../../../domain/entities/User";

export class DeleteUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(id: string): Promise<boolean> {
        return await this.userRepository.delete(id);
    }
}