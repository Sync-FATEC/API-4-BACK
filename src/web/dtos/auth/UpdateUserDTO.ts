export class UpdateUserDTO {
    private id: string;
    private name: string;
    private email: string;
    private cpf: string;

    constructor(id: string, name: string, email: string, cpf: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.cpf = cpf;
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
}