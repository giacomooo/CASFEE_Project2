import { Parking, ParkingInterface } from './Parking';

export interface Reservation {
  id: number;
  ID_Parking: Parking; // todo: ID_Parking umbenennen auf Backend
  ID_Renter: string;
  DateTimeFrom: Date;
  DateTimeTo: Date;
  PricePerHour: number;
  Amount: number;
  IsCanceled: boolean;
}

export class Reservation implements Reservation {
}
