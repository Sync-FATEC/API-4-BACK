import { off } from "process";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import Parameter from "./Parameter";

@Entity()
export class TypeParameter {
    @PrimaryColumn("uuid")
    id: string;

    @Column()
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