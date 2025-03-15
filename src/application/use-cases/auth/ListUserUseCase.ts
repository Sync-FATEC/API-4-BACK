import { IUserRepository, User } from "../../../domain/entities/User";

export class ListUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(): Promise<User[]> {
        return await this.userRepository.list();
    }
}