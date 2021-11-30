export interface ParkingInterface {
  id: number;
  ID_Landlord: string;
  Street: string;
  StreetNo: string;
  StreetNoSuffix: string;
  ZIP: number;
  Location: string;
  PricePerHour: number;
}

export class Parking {
  constructor(ZIP?: number, Location?: string, PricePerHour?: number, Street?: string, StreetNo?: number, StreetNoSuffix?: string) {
    this.ZIP = ZIP;
    this.Location = Location;
    this.PricePerHour = PricePerHour;
    this.Street = Street;
    this.StreetNo = StreetNo;
    this.StreetNoSuffix = StreetNoSuffix;
  }

  id?: number | undefined;
  ID_Landlord?: string | undefined;
  ZIP: number | undefined;
  Location: string | undefined;
  PricePerHour: number | undefined;
  Street: string | undefined;
  StreetNo?: number | undefined;
  StreetNoSuffix?: string | undefined;
}

export class ParkListItem {
  parking?: Parking;
  isPending: boolean = false;
}
