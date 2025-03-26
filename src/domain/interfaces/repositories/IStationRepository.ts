import { Station } from "../../models/entities/Station";

export interface IStationRepository {
    create(station: Partial<Station>): Promise<Station>;
    delete(id: string): Promise<boolean>;
    update(id: string, station: Partial<Station>): Promise<Station>;
    list(): Promise<Station[]>;
    listWithParameters(): Promise<Station[]>;
    findById(id: string): Promise<Station | null>;
    findByUuid(id: string): Promise<Station | null>;
}