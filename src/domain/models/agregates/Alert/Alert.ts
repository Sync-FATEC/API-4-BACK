import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { TypeAlert } from "./TypeAlert";
import { Measure } from "../../entities/Measure";

@Entity()
export class Alert {
 
    @PrimaryColumn("uuid")
    id: string;

    @Column()
    date: Date;

    @ManyToOne(() => TypeAlert, (typeAlert) => typeAlert.alerts)
    @JoinColumn({ name: "typeId" })
    type: TypeAlert;

    @ManyToOne(() => Measure, (measure) => measure.alerts)
    @JoinColumn({ name: "measureId" })
    measure: Measure;
}