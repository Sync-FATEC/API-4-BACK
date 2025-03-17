import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import Parameter from "../Parameter/Parameter";
import { Alert } from "./Alert";

@Entity()
export class TypeAlert {
    @PrimaryColumn("uuid")
    id: string;
    
    @Column()
    name: string;
    
    @OneToMany(() => Parameter, parameter => parameter)
    @JoinColumn({ name: "parameterId" })
    parameter: Parameter;

    @OneToMany(() => Alert, (alert) => alert.type)
    alerts: Alert[];
}