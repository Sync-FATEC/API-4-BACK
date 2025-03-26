
export default class ListParameterDTO {

    private id: string;
    private idTypeParameter: string;
    private idStation: string;
    private text: string;

    constructor(id: string, text: string) {
        this.id = id;
        this.text = text;
    }

    public getId(): string {
        return this.id;
    }

    public getIdTypeParameter(): string {
        return this.idTypeParameter;
    }

    public getIdStation(): string {
        return this.idStation;
    }

    public getText(): string {
        return this.text;
    }
}