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

export interface ITypeParameterRepository {
    create(typeParameter: Partial<TypeParameter>): Promise<TypeParameter>;
    delete(id: string): Promise<boolean>;
    update(id: string, typeParameter: Partial<TypeParameter>): Promise<TypeParameter | null>;
    list(): Promise<TypeParameter[]>;
    findById(id: string): Promise<TypeParameter | null>;
    findByName(name: string): Promise<TypeParameter | null>;
}