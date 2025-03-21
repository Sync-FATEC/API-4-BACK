import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { TypeAlert } from "./TypeAlert";
import { Measure } from "../../entities/Measure";

@Entity()
export class Alert {
 
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /** Data em que o alerta foi gerado na medida UnixTime */
    @Column()
    date: number;

    @ManyToOne(() => TypeAlert, (typeAlert) => typeAlert.alerts)
    @JoinColumn({ name: "typeId" })
    type: TypeAlert;

    @ManyToOne(() => Measure, (measure) => measure.alerts)
    @JoinColumn({ name: "measureId" })
    measure: Measure;


    public static create(date: number, type: TypeAlert, measure: Measure): Alert {
        let alert = new Alert();
        alert.date = date;
        alert.type = type;
        alert.measure = measure;
        return alert;
    }
}