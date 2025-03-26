import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Alert } from "../Alert/Alert";

@Entity()
export class Measure {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    unixTime: number;

    @Column()
    value: number;

    @OneToMany(() => Alert, (alert) => alert.measure)
    alerts: Alert[];

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
