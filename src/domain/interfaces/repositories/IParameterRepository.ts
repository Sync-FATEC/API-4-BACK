import ListParameterDTO from "../../../web/dtos/parameter/ListParameterDTO";
import Parameter from "../../models/agregates/Parameter/Parameter";

export interface IParameterRepository {
    create(parameter: Partial<Parameter>): Promise<Parameter>;
    delete(id: string): Promise<boolean>;
    update(id: string, parameter: Partial<Parameter>): Promise<Parameter>;
    list(): Promise<Parameter[]>;
    listDTO(): Promise<ListParameterDTO[]>;
    findById(id: string): Promise<Parameter | null>;
}

