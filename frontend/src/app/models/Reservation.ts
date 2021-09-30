import { Parking } from "./Parking";

export interface Reservation {
  id: number;
  ID_parking: number;
  Parking: Parking;
  ID_Renter: number;
  DateFrom: Date;
  DateTo: Date;
  PricePerHour: number;
  IsCanceled: boolean;
}
