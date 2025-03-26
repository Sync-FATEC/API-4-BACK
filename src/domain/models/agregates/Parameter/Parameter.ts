import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { TypeParameter } from "../../entities/TypeParameter";
import { Station } from "../../entities/Station";
import { TypeAlert } from "../Alert/TypeAlert";
import { Measure } from "../../entities/Measure";

@Entity()
export default class Parameter {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => TypeParameter, (typeParameter) => typeParameter.parameters)
    idTypeParameter: TypeParameter;

    @ManyToOne(() => Station, (station) => station.parameters)
    idStation: Station;

    @OneToMany(() => TypeAlert, (typeAlert) => typeAlert.parameter)
    typeAlerts: TypeAlert[];

    @OneToMany(() => Measure, (measure) => measure.parameter)
    measures: Measure[];

    public getParameterName(): string {
        return this.idStation.name + " - " + this.idTypeParameter.name;
    }
}
