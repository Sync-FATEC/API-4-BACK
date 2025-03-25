import { TypeAlertDTO } from "../../../web/dtos/alert/typeAlert/TypeAlertDTO";
import { TypeAlert } from "../../models/agregates/Alert/TypeAlert";

export interface ITypeAlertRepository {
    findById(id: string): Promise<TypeAlert | null>;
    findAll(): Promise<TypeAlertDTO[]>;
    create(typeAlert: TypeAlert): Promise<TypeAlert>;
    update(id: string, typeAlert: Partial<TypeAlert>): Promise<TypeAlert | null>;
    delete(id: string): Promise<boolean>;
}
