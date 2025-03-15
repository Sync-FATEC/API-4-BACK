export default class RegisterUserDTO {
    protected name: string;
    private email: string;
    private cpf: string;
    private password: string;

    constructor(name: string, email: string, password: string, cpf: string) {
        this.name = name;
        this.email = email;
        this.password = password;
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

    public getPassword(): string {
        return this.password;
    }
}