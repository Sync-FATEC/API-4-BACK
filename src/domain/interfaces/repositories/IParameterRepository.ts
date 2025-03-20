import Parameter from "@/domain/models/agregates/Parameter/Parameter";

export interface IParameterRepository {
    getParameterById(id: string): Promise<Parameter | null>;
    getAllParameters(): Promise<Parameter[]>;
    createParameter(parameter: Parameter): Promise<Parameter>;
    updateParameter(id: string, parameter: Partial<Parameter>): Promise<Parameter | null>;
    deleteParameter(id: string): Promise<boolean>;
}

