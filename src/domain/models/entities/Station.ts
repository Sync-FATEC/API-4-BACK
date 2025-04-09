import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Parameter from "../agregates/Parameter/Parameter";
import { MeasureAverage } from "./MeasureAverage";

@Entity()
export class Station {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ unique: true, nullable: false })
  public uuid: string;

  @Column({ nullable: false })
  public name: string;

  @Column()
  public latitude: string;

  @Column()
  public longitude: string;

  @Column()
  public createdAt: Date;

  @Column({ type: 'bigint', nullable: true })
  public DateLastMeasure: number;  

  @OneToMany(() => Parameter, (parameter) => parameter.idStation)
  parameters: Parameter[];

  @OneToMany(() => MeasureAverage, (average) => average.station)
  measureAverages: MeasureAverage[];

}
