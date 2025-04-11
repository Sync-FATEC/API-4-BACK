import Parameter from "../../models/agregates/Parameter/Parameter";
import ListParameterDTO from "../../../web/dtos/parameter/ListParameterDTO";

export interface IParameterRepository {
    findById(id: string): Promise<Parameter | null>;
    list(): Promise<Parameter[]>;
    create(parameter: Partial<Parameter>): Promise<Parameter>;
    update(id: string, parameter: Partial<Parameter>): Promise<Parameter | null>;
    delete(id: string): Promise<boolean>;
    listDTO(): Promise<ListParameterDTO[]>;
    getWithParameterThenInclude(id: string): Promise<Parameter | null>;
}

