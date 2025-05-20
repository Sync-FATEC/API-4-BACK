import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Logs {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    action: string;

    @Column()
    timestamp: Date;

    @OneToMany(() => User, (user) => user.id)
    user: User[];
}
