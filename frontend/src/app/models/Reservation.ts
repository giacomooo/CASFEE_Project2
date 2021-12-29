// eslint-disable-next-line max-classes-per-file
import { Parking } from './Parking';

export interface Reservation {
  id: number;
  ID_Parking: Parking;
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
