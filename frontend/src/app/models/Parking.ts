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

export class Parking implements ParkingInterface {
}
