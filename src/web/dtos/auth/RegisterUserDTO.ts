export default class RegisterUserDTO {
    protected name: string;
    private email: string;
    private cpf: string;
    private role: string;

    constructor(name: string, email: string, cpf: string, role: string) {
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.role = role;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public getCpf(): string {
        return this.cpf;
    }

    public getRole(): string {
        return this.role;
    }
}