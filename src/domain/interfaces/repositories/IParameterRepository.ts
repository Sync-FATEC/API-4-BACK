import Parameter from "../../models/agregates/Parameter/Parameter";

export interface IParameterRepository {
    create(parameter: Parameter): Promise<Parameter>;
    delete(id: string): Promise<boolean>;
    update(id: string, parameter: Partial<Parameter>): Promise<Parameter>;
    list(): Promise<Parameter[]>;
    findById(id: string): Promise<Parameter | null>;
}

