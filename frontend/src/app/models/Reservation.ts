import { Parking } from './Parking';

export interface Reservation {
  id: number;
  ID_Parking: number;
  ID_Renter: string;
  DateTimeFrom: Date;
  DateTimeTo: Date;
  PricePerHour: number;
  Amount: number;
  IsCanceled: boolean;
  Parking?: Parking;
}

export class Reservation implements Reservation {
}
