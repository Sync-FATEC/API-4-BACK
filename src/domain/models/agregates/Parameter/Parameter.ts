import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import { TypeParameter } from "./TypeParameter";
import { Station } from "../../entities/Station";

@Entity()
export default class Parameter {

  @PrimaryColumn("uuid")
    id: string;

    @OneToMany(() => TypeParameter, typeParameter => typeParameter)
    typeParameter: TypeParameter   

    @OneToMany(() => Station, station => station)
    station: Station
}