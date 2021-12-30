import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { ParkingService } from 'src/app/services/parking.service';

@Injectable({
  providedIn: 'root',
})
export class AsyncService {
  constructor(private readonly parkingService: ParkingService) {
  }

  public existsReservationValidator(
    idParkingFieldName: string,
    idReservationFieldName: string,
    dateTimeFromFieldName: string,
    dateTimeToFieldName: string,
  ): ValidatorFn {
    return (form: AbstractControl): { [key: string]: boolean } | null => {
      const idParking = form.get(idParkingFieldName);
      const idReservation = form.get(idReservationFieldName);
      const dateTimeFromControl = form.get(dateTimeFromFieldName);
      const dateTimeToControl = form.get(dateTimeToFieldName);

      if (!dateTimeFromControl || !dateTimeToControl || (dateTimeToControl.pristine && dateTimeFromControl.pristine)) return null;

      const newFrom = new Date(dateTimeFromControl.value);
      const newTo = new Date(dateTimeToControl.value);

      this.parkingService.readParkingReservations(idParking?.value.id).subscribe((result) => {
        const otherReservations = result.filter((reservation) => reservation.id !== idReservation?.value);

        const toInRange = otherReservations.filter((reservation) => new Date(reservation.DateTimeTo) > newFrom
            && new Date(reservation.DateTimeTo) < newTo);
        if (toInRange.length > 0) {
          const msg = { value: `Parkplatz ist erst ab ${moment(toInRange[0].DateTimeTo).format('HH:mm')} frei.` };
          const err = { existsReservationValidator: msg };
          dateTimeFromControl?.setErrors(err);
        }

        const fromInRange = otherReservations.filter((reservation) => new Date(reservation.DateTimeFrom) < newTo
            && new Date(reservation.DateTimeFrom) > newFrom);
        if (fromInRange.length > 0) {
          const msg = { value: `Parkplatz ist nur bis ${moment(fromInRange[0].DateTimeFrom).format('HH:mm')} frei.` };
          const err = { existsReservationValidator: msg };
          dateTimeToControl?.setErrors(err);
        }

        const overRange = otherReservations.filter((reservation) => new Date(reservation.DateTimeFrom) < newFrom
            && new Date(reservation.DateTimeTo) > newTo);
        if (overRange.length > 0) {
          const msg = { value: 'Parkplatz in Zeitraum bereits besetzt.' };
          const err = { existsReservationValidator: msg };
          dateTimeFromControl?.setErrors(err);
        }
      });
      return null;
    };
  }
}
