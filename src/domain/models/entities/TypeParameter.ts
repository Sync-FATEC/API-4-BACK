import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Parameter from "../agregates/Parameter/Parameter";

@Entity()
export class TypeParameter {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    typeJson: string;
    
    @Column({ unique: true })
    name: string;

    @Column()
    unit: string;
    
    @Column()
    numberOfDecimalsCases: number;

    @Column()
    factor: number;

    @Column()
    offset: number;

    @OneToMany(() => Parameter, (parameter) => parameter.idTypeParameter)
    parameters: Parameter[];
}
