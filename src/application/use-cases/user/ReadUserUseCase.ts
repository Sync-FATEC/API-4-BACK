import { IUserRepository } from "../../../domain/models/entities/User";
import { ReadUserDTO } from "../../../web/dtos/user/ReadUserDTO";
import { transformUserToDTO } from "../../operations/user/transformeUserToDTO";

export class ReadUserUseCase {
    constructor(private userRepository: IUserRepository) {}
    
    async execute(id: string): Promise<ReadUserDTO> {
        const user = await this.userRepository.findById(id);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return transformUserToDTO(user);
    }
}