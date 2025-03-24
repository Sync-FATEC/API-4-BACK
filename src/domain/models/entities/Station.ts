import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Station {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ unique: true, nullable: false })
  public uuid: string

  @Column({ nullable: false })
  public name: string;

  @Column()
  public latitude: string;

  @Column()
  public longitude: string;

  @Column()
  public createdAt: Date;
}

export interface IStationRepository {
  create(station: Partial<Station>): Promise<Station>;
  delete(id: string): Promise<boolean>;
  update(id: string, station: Partial<Station>): Promise<Station | null>;
  list(): Promise<Station[]>;
  findById(id: string): Promise<Station | null>;
  findByUuid(uuid: string): Promise<Station | null>;
}
