import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Alert } from "../agregates/Alert/Alert";

@Entity()
export class Measure {

    @PrimaryColumn("uuid")
    id: string;
    
    @Column()
    unixTime: number;

    @Column()
    value: number;

    @OneToMany(() => Alert, alert => alert.measure)
    alerts: Alert[];    
}