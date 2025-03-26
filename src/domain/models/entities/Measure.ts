import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Alert } from "../agregates/Alert/Alert";
import Parameter from "../agregates/Parameter/Parameter";

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

    @ManyToOne(() => Parameter, (parameter) => parameter.measures)  
    parameter: Parameter;

    public static create(unixTime: number, value: number): Measure {
        const measure = new Measure();
        measure.unixTime = unixTime;
        measure.value = value;
        return measure;
    }

    public static update(measure: Measure, unixTime: number, value: number): void {
        measure.unixTime = unixTime;
        measure.value = value;
    }
}