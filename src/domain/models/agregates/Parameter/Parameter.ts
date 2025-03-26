import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { TypeParameter } from "../../entities/TypeParameter";
import { Station } from "../../entities/Station";

@Entity()
export default class Parameter {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => TypeParameter, (typeParameter) => typeParameter.parameters)
    idTypeParameter: TypeParameter;

    @ManyToOne(() => Station, (station) => station.parameters)
    idStation: Station;
}
