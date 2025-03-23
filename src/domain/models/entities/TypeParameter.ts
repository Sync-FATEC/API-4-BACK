import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Parameter from "../agregates/Parameter/Parameter";

@Entity()
export class TypeParameter {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    typeJson: string;
    
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