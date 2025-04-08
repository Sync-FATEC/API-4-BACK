import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { Station } from "./Station";
import { enumAverage } from "../../enums/MeasureAverage/enumAverage";

@Entity()
export class MeasureAverage {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({
        type: 'enum',
        enum: enumAverage
    })
    public typeAverage: enumAverage;

    @Column({ nullable: false })
    public name: string;

    @Column({ nullable: false })
    public value: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    public createdAt: Date;

    @ManyToOne(() => Station, (station) => station.measureAverages)
    stationId: Station;

    public CreateMeasureAverage(typeAverage: enumAverage, name: string, value: string) {
        this.typeAverage = typeAverage;
        this.name = name;
        this.value = value;
    }


    public GetId() {
        return this.id;
    }

    public GetTypeAverage() {
        return this.typeAverage;
    }

    public GetName() {
        return this.name;
    }

    public GetValue() {
        return this.value;
    }
}
