export class UpdateUserDTO {
    private id: string;
    private name: string;
    private email: string;
    private cpf: string;
    private role: string;

    constructor(id: string, name: string, email: string, cpf: string, role: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.role = role;
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

    public getRole(): string {
        return this.role;
    }
}