export class ReadUserDTO {
    private id: string;
    private name: string;
    private email: string;
    private cpf: string;
    private role: string;
    private createdAt: Date;
    private active: boolean;

    constructor(id: string,name: string, email: string, cpf: string, role: string, createdAt: Date, active: boolean) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.role = role;
        this.createdAt = createdAt;
        this.active = active;
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

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getActive(): boolean {
        return this.active;
    }
}