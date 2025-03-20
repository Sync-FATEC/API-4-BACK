import { hash } from "bcryptjs";

export default async function hashPassword(password: string) {
    return await hash(password, 8);
}