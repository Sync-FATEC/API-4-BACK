import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Station {
  @PrimaryGeneratedColumn("uuid")
  private id: string;

  @Column({ unique: true, nullable: false })
  private name: string;

  @Column()
  private latitude: string;

  @Column()
  private longitude: string;

  @Column()
  private altitude: string;
}

export interface IStationRepository {
  create(station: Partial<Station>): Promise<Station>;
  delete(id: string): Promise<boolean>;
  update(id: string, station: Partial<Station>): Promise<Station | null>;
  list(): Promise<Station[]>;
  findById(id: string): Promise<Station | null>;
}
