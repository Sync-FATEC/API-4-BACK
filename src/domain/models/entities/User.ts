
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true, nullable: false })
    email!: string;

    @Column({ nullable: true })
    password!: string;

    @Column({ nullable: true, default: 'user' })
    role!: string;

    @Column({ unique: true, nullable: true, length: 11 })
    cpf!: string;

    @CreateDateColumn()
    createdAt!: Date;

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

    public getId(): string {
        return this.id;
    }
}

export interface IUserRepository {
    create(user: Partial<User>): Promise<User>;
    delete(id: string): Promise<boolean>;
    update(id: string, user: Partial<User>): Promise<User | null>;
    list(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByCpf(cpf: string): Promise<User | null>;
} 