import { verify } from 'jsonwebtoken';
import { TokenPayload } from '../../domain/interfaces/TokenPayload';

export class AuthService {
    private static instance: AuthService;
    private readonly jwtSecret: string;

    private constructor() {
        this.jwtSecret = process.env.JWT_SECRET;
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public verifyToken(token: string): TokenPayload {
        try {
            return verify(token, this.jwtSecret) as TokenPayload;
        } catch (error) {
            throw new Error('Token inválido ou expirado');
        }
    }

    public extractTokenFromHeader(authHeader: string | undefined): string {
        if (!authHeader) {
            throw new Error('Token não fornecido');
        }

        const [, token] = authHeader.split(' ');
        if (!token) {
            throw new Error('Formato de token inválido');
        }

        return token;
    }

    public validateAdminRole(role: string): void {
        if (role !== 'admin') {
            throw new Error('Acesso não autorizado: usuário não é administrador');
        }
    }
} 