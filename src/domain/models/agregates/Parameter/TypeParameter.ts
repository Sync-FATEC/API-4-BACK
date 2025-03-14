import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import Parameter from "./Parameter";
import { TypeJson } from "../../../enums/TypeJson";


@Entity()
export class TypeParameter {
    @PrimaryColumn("uuid")
    id: string;

    @Column({
        type: "enum",
        enum: TypeJson,
        nullable: true,
    })
    typeJson: TypeJson;
    
    @Column()
    name: string;

    @Column()
    unit: string;
    
    @Column()
    numberOfDecimalsCases: number;

    @Column()
    factor: number;

    @Column()
    offset: number;

    @ManyToOne(() => Parameter, (parameter) => parameter.typeParameter)
    parameter: Parameter[];
}