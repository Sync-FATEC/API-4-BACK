import { TypeParameter } from "../../models/entities/TypeParameter";

export interface ITypeParameterRepository {
    create(typeParameter: Partial<TypeParameter>): Promise<TypeParameter>;
    delete(id: string): Promise<boolean>;
    update(id: string, typeParameter: Partial<TypeParameter>): Promise<TypeParameter | null>;
    list(): Promise<TypeParameter[]>;
    findById(id: string): Promise<TypeParameter | null>;
    findByName(name: string): Promise<TypeParameter | null>;
    findByTypeJson(typeJson: string): Promise<TypeParameter | null>;
}