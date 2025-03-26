export default class UpdateTypeParameterDTO {
    private id: string;
    private name: string;
    private unit: string;
    private numberOfDecimalsCases: number;
    private factor: number;
    private offset: number;
    private typeJson: string;

    constructor(id: string, name: string, unit: string, numberOfDecimalsCases: number, factor: number, offset: number, typeJson: string) {
        this.id = id;
        this.name = name;
        this.unit = unit;
        this.numberOfDecimalsCases = numberOfDecimalsCases;
        this.factor = factor;
        this.offset = offset;
        this.typeJson = typeJson;
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getUnit(): string {
        return this.unit;
    }

    public getNumberDecimalPlaces(): number {
        return this.numberOfDecimalsCases;
    }

    public getfactor(): number {
        return this.factor;
    }

    public getOffset(): number {
        return this.offset;
    }

    public getTypeJson(): string {
        return this.typeJson;
    }
}