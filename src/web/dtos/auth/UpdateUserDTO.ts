export class UpdateUserDTO {
    private id: string;
    private name: string;
    private email: string;
    private cpf: string;
    private password: string;

    constructor(id: string, name: string, email: string, cpf: string, password: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.password = password;
    }

    public getId(): string {
        return this.id;
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