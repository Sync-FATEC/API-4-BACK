export default class RegisterUserDTO {
    protected name: string;
    private email: string;
    private cpf: string;

    constructor(name: string, email: string, cpf: string) {
        this.name = name;
        this.email = email;
        this.cpf = cpf;
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
}