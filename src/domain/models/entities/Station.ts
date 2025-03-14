import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Station {
  @PrimaryColumn("uuid")
  private id: number;

  @Column({ unique: true, nullable: false })
  private name: string;

  @Column()
  private latitude: number;

  @Column()
  private longitude: number;

  @Column()
  private altitude: number;
}
