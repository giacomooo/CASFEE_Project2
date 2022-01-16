import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { ParkingService } from 'src/app/services/parking.service';

@Injectable({
  providedIn: 'root',
})
export class ExistsReservationValidator {
  constructor(private readonly parkingService: ParkingService) {
  }

  public validate(
    idParkingFieldName: string,
    idReservationFieldName: string,
    dateTimeFromFieldName: string,
    dateTimeToFieldName: string,
  ): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const idParking = form.get(idParkingFieldName);
      const idReservation = form.get(idReservationFieldName);
      const dateTimeFromControl = form.get(dateTimeFromFieldName);
      const dateTimeToControl = form.get(dateTimeToFieldName);

      if (!dateTimeFromControl || !dateTimeToControl || (dateTimeToControl.pristine && dateTimeFromControl.pristine)) return null;

      const newFrom = new Date(dateTimeFromControl.value);
      const newTo = new Date(dateTimeToControl.value);

      this.parkingService.readParkingReservations(idParking?.value.id).subscribe((result) => {
        dateTimeFromControl?.setErrors(null);
        dateTimeToControl?.setErrors(null);

        const otherReservations = result.filter((reservation) => reservation.id !== idReservation?.value);
        const toInRange = otherReservations.filter((reservation) => new Date(reservation.DateTimeTo) > newFrom
          && new Date(reservation.DateTimeTo) < newTo);
        const fromInRange = otherReservations.filter((reservation) => new Date(reservation.DateTimeFrom) < newTo
          && new Date(reservation.DateTimeFrom) > newFrom);
        const overRange = otherReservations.filter((reservation) => new Date(reservation.DateTimeFrom) < newFrom
          && new Date(reservation.DateTimeTo) > newTo);

        if (toInRange.length > 0) {
          const msg = { value: `Parkplatz ist erst ab ${moment(toInRange[0].DateTimeTo).format('HH:mm')} frei.` };
          const err = { existsReservationValidator: msg };
          dateTimeFromControl?.setErrors(err);
          return { dateTimeFromFieldName: { value: true } };
        }

        if (fromInRange.length > 0) {
          const msg = { value: `Parkplatz ist nur bis ${moment(fromInRange[0].DateTimeFrom).format('HH:mm')} frei.` };
          const err = { existsReservationValidator: msg };
          dateTimeToControl?.setErrors(err);
          return { dateTimeToFieldName: { value: true } };
        }

        if (overRange.length > 0) {
          const msg = { value: 'Parkplatz in Zeitraum bereits besetzt.' };
          const err = { existsReservationValidator: msg };
          dateTimeFromControl?.setErrors(err);
          dateTimeToControl?.setErrors(err);
          return { dateTimeFromFieldName: { value: true }, dateTimeToFieldName: { value: true } };
        }
        return null;
      });
      return null;
    };
  }
}
