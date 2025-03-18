export interface TokenPayload {
    name: string;
    role: string;
    iat: number;
    exp: number;
}

export interface UserRequest {
    name: string;
    role: string;
} 