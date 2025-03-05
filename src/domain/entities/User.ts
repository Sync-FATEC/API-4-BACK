import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true, nullable: false })
    email!: string;

    @Column()
    password!: string;

    @Column({ nullable: true, default: 'user' })
    role!: string;

    @Column({ unique: true, nullable: true, length: 11 })
    cpf!: string;

    @CreateDateColumn()
    createdAt!: Date;
}

export interface IUserRepository {
    create(user: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByCpf(cpf: string): Promise<User | null>;
} 