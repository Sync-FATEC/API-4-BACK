export default class CreateStationDTO {
  private name: string;
  private latitude: string;
  private longitude: string;
  private altitude: string;

  constructor(name: string, latitude: string, longitude: string, altitude: string) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
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

  public getAltitude(): string {
    return this.altitude;
  }
}
