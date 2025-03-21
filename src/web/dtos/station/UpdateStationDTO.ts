export default class UpdateStationDTO {
    private id: string;
    private uuid: string;
    private name: string;
    private latitude: string;
    private longitude: string;

    constructor(id: string, uuid: string, name: string, latitude: string, longitude: string) {
        this.id = id;
        this.uuid = uuid;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    public getId(): string {
        return this.id;
    }

    public getUuid(): string {
        return this.uuid;
    }

    public getName(): string {
        return this.name;
    }
    
    public getLatitude(): string {
        return this.latitude;
    }
    
    public getLongitude(): string {
        return this.longitude;
    }
}