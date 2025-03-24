import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

    @OneToMany(() => Parameter, (parameter) => parameter.typeParameter)
    parameters: Parameter[];
}
