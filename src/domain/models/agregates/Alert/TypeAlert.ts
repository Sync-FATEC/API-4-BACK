import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Parameter from "../Parameter/Parameter";
import { Alert } from "./Alert";
import { ComparisonOperator } from "../../../enums/TypeAlert/ComparisonOperator";
import { Criticality } from "../../../enums/TypeAlert/Criticality";

@Entity()
export class TypeAlert {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ type: "float" })
  value: number;

  @Column({
    type: "enum",
    enum: ComparisonOperator,
    nullable: false,
  })
  comparisonOperator: ComparisonOperator;

  @Column({
    type: "enum",
    enum: Criticality,
    nullable: false,
  })
  criticality: Criticality;

  @ManyToOne(() => Parameter, (parameter) => parameter.typeAlerts)
  parameter: Parameter;

  @OneToMany(() => Alert, (alert) => alert.type)
  alerts: Alert[];

  public static create(
    name: string,
    comparisonOperator: ComparisonOperator,
    criticality: Criticality,
    value: number,
    parameter: Parameter
  ): TypeAlert {
    const typeAlert = new TypeAlert();
    typeAlert.name = name;
    typeAlert.comparisonOperator = comparisonOperator;
    typeAlert.parameter = parameter;
    typeAlert.value = value;
    typeAlert.criticality = criticality;
    return typeAlert;
  }
}
