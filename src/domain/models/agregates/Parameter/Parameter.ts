import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { TypeParameter } from "../../entities/TypeParameter";
import { Station } from "../../entities/Station";
import { TypeAlert } from "../Alert/TypeAlert";

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
}
