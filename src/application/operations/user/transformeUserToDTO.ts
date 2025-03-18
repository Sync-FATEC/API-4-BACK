import { User } from "../../../domain/models/entities/User";
import { ReadUserDTO } from "../../../web/dtos/user/ReadUserDTO";

export function transformUserToDTO(user: User): ReadUserDTO {
    const readUser = new ReadUserDTO(user.getId(), user.getName(), user.getEmail(), user.getCpf(), user.getRole());
    return readUser;
}