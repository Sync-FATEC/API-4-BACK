import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import Parameter from "../Parameter/Parameter";
import { Alert } from "./Alert";
import { ComparisonOperator } from "../../../enums/TypeAlert/ComparisonOperator";

@Entity()
export class TypeAlert {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  value: number;

  @Column({
    type: "enum",
    enum: ComparisonOperator,
    nullable: false,
  })
  comparisonOperator: ComparisonOperator;

  @ManyToOne(() => Parameter, (parameter) => parameter.typeAlerts)
  parameter: Parameter;

  @OneToMany(() => Alert, (alert) => alert.type)
  alerts: Alert[];

  public static create(
    name: string,
    comparisonOperator: ComparisonOperator,
    value: number,
    parameter: Parameter
  ): TypeAlert {
    const typeAlert = new TypeAlert();
    typeAlert.name = name;
    typeAlert.comparisonOperator = comparisonOperator;
    typeAlert.parameter = parameter;
    typeAlert.value = value;
    return typeAlert;
  }

  public static update(
    typeAlert: TypeAlert,
    name: string,
    comparisonOperator: ComparisonOperator,
    parameter: Parameter
  ): void {
    typeAlert.name = name;
    typeAlert.comparisonOperator = comparisonOperator;
    typeAlert.parameter = parameter;
  }
}
