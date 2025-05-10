import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
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
    station: Station;

    public CreateMeasureAverage(typeAverage: enumAverage, name: string, value: string): void {
        this.typeAverage = typeAverage;
        this.name = name;
        this.value = value;
    }


    public GetId(): string {
        return this.id;
    }

    public GetTypeAverage(): enumAverage {
        return this.typeAverage;
    }

    public GetName(): string {
        return this.name;
    }

    public GetValue(): string {
        return this.value;
    }
}
