import { TypeAlert } from "../../models/agregates/Alert/TypeAlert";

export interface ITypeAlertRepository {
    findById(id: string): Promise<TypeAlert | null>; // Usando findById para busca
    findAll(): Promise<TypeAlert[]>;
    create(typeAlert: TypeAlert): Promise<TypeAlert>;
    update(id: string, typeAlert: Partial<TypeAlert>): Promise<TypeAlert | null>;
    delete(id: string): Promise<boolean>;
}
