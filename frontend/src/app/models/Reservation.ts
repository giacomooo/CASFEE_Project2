import { Parking } from './Parking';

export interface Reservation {
  id: number;
  ID_Parking: number;
  Parking: Parking;
  ID_Renter: string;
  DateTimeFrom: Date;
  DateTimeTo: Date;
  PricePerHour: number;
  Amount: number;
  IsCanceled: boolean;
}

export class Reservation implements Reservation {
}
