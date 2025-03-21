export default class CreateStationDTO {
  private name: string;
  private uuid: string;
  private latitude: string;
  private longitude: string;

  constructor(name: string, uuid: string, latitude: string, longitude: string) {
    this.name = name;
    this.uuid = uuid;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  public getName(): string {
    return this.name;
  }

  public getUuid(): string {
    return this.uuid;
  }

  public getLatitude(): string {
    return this.latitude;
  }

  public getLongitude(): string {
    return this.longitude;
  }
}
