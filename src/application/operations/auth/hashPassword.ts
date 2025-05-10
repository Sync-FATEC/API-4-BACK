import { hash } from "bcryptjs";

export default async function hashPassword(password: string): Promise<string> {
    return await hash(password, 8);
}