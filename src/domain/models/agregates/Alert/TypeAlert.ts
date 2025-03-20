import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import Parameter from "../Parameter/Parameter";
import { Alert } from "./Alert";
import ComparisonOperator from "@/domain/enums/TypeAlert/MathOperator";

@Entity()
export class TypeAlert {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    name: string;

    @Column({
        type: "enum",
        enum: ComparisonOperator,
        nullable: false,
    })
    comparisonOperator: ComparisonOperator;
    
    @OneToMany(() => Parameter, parameter => parameter)
    @JoinColumn({ name: "parameterId" })
    parameter: Parameter;

    @OneToMany(() => Alert, (alert) => alert.type)
    alerts: Alert[];

    public static create(name: string, comparisonOperator: ComparisonOperator, parameter: Parameter): TypeAlert {
        const typeAlert = new TypeAlert();
        typeAlert.name = name;
        typeAlert.comparisonOperator = comparisonOperator;
        typeAlert.parameter = parameter;
        return typeAlert;
    }

    public static update(typeAlert: TypeAlert, name: string, comparisonOperator: ComparisonOperator, parameter: Parameter): void {
        typeAlert.name = name;
        typeAlert.comparisonOperator = comparisonOperator;
        typeAlert.parameter = parameter;
    }
}