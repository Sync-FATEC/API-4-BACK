import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Station } from "./Station";

@Entity()
export class EmailStation {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: false })
  public email: string;

  @ManyToOne(() => Station, station => station.emailsToAlert)
  public station: Station[];    
}