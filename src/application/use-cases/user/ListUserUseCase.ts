import { IUserRepository } from "../../../domain/models/entities/User";
import { ReadUserDTO } from "../../../web/dtos/user/ReadUserDTO";
import { transformUserToDTO } from "../../operations/user/transformeUserToDTO";

export class ListUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(): Promise<ReadUserDTO[]> {
        const userList = await this.userRepository.list();

        const readUserList: ReadUserDTO[] = [];

        userList.map((user) => {
            readUserList.push(transformUserToDTO(user))
        });
        
        return readUserList;
    }
}