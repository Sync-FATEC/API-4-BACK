import { Station } from "../../../domain/models/entities/Station";
import { TypeParameter } from "../../../domain/models/entities/TypeParameter";

export default class CreateParameterDTO {
    private idTypeParameter: TypeParameter;
    private idStation: Station;

    constructor(idTypeParameter: TypeParameter, idStation: Station) {
        this.idTypeParameter = idTypeParameter;
        this.idStation = idStation;
    }

    public getIdTypeParameter(): TypeParameter {
        return this.idTypeParameter;
    }

    public getIdStation(): Station {
        return this.idStation;
    }
}