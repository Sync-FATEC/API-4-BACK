import { TypeParameter } from "../../../domain/models/entities/TypeParameter";
import { Station } from "../../../domain/models/entities/Station";

export default class UpdateParameterDTO {
    private id: string;
    private idTypeParameter: TypeParameter;
    private idStation: Station;

    constructor(id: string, idTypeParameter: TypeParameter, idStation: Station) {
        this.id = id;
        this.idTypeParameter = idTypeParameter;
        this.idStation = idStation;
    }

    public getId(): string {
        return this.id;
    }

    public getIdTypeParameter(): TypeParameter {
        return this.idTypeParameter;
    }

    public getIdStation(): Station {
        return this.idStation;
    }
}