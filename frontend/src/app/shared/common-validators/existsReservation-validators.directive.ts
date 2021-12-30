import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Reservation } from 'src/app/models/Reservation';
import { ParkingService } from 'src/app/services/parking.service';

@Injectable({
  providedIn: 'root',
})
export class AsyncService {
  private x4: Reservation[] = [];
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

      console.log("f", newFrom, ", t" ,  newTo);
      this.parkingService.readParkingReservations(idParking?.value.id).subscribe((result) => {
        console.log("alle", result);
        const x = result.filter((reservation) => reservation.id !== idReservation?.value);
        console.log("no self", x);
        const x2 = result.filter((reservation) => new Date(reservation.DateTimeTo) >= newFrom
            && new Date(reservation.DateTimeTo) <= newTo);
        console.log("to in Range", x2);
        const x3 = result.filter((reservation) => new Date(reservation.DateTimeFrom) <= newTo
            && new Date(reservation.DateTimeFrom) >= newFrom);
        console.log("from in Range", x3);
        this.x4 = x.filter((reservation) => new Date(reservation.DateTimeFrom) <= newFrom
            && new Date(reservation.DateTimeTo) >= newTo);
        console.log(this.x4);
        this.x4.concat(result);
        console.log(this.x4.length);
        if (this.x4.length > 0) {
          const msg = { value: 'Parkplatz in Zeitraum bereits besetzt.' };
          const err = { existsReservationValidator: msg };
          dateTimeFromControl?.setErrors(err);
        }
      });


      //    dateTimeFromControl?.setErrors(null);

      // if (new Date(form.get(dateTimeToFieldName)?.value) < new Date(dateTimeFromControl?.value)) {
      //   const msg = {value: "Bitte korrekten Zeitraum wählen."};
      //   const err = { dateBeforeValidator: msg  };
      //   dateTimeFromControl?.setErrors(err);
      // }
      return null;
    };
  }
}
// import { AbstractControl, ValidatorFn } from '@angular/forms';

// export function existsReservationValidator(
//   idParking: string,
//   dateTimeFromFieldName: string,
//   dateTimeToFieldName: string,
// ): ValidatorFn {
//   return (form: AbstractControl): { [key: string]: boolean } | null => {
//     const id = form.get(idParking);
//     const dateTimeFromControl = form.get(dateTimeFromFieldName);
//     const dateTimeToControl = form.get(dateTimeToFieldName);

//     if (!dateTimeFromControl || !dateTimeToControl || (dateTimeToControl.pristine && dateTimeFromControl.pristine)) return null;

//     console.log(id?.value.id);

//     // const injector = Injector.create([{ provide: ParkingService, useClass: ParkingService, deps: [] }]);
//     // const injector = Injector.create({ providers: [{ provide: ParkingService, useClass: ParkingService }] });
//     // const x = injector.get(HttpClient);
//     // const parkingService = injector.get(ParkingService);

//     this.parkingService.readParkingReservations(id?.value.id).subscribe((result) => {
//       console.log(result);
//     });

//     //    dateTimeFromControl?.setErrors(null);

//     // if (new Date(form.get(dateTimeToFieldName)?.value) < new Date(dateTimeFromControl?.value)) {
//     //   const msg = {value: "Bitte korrekten Zeitraum wählen."};
//     //   const err = { dateBeforeValidator: msg  };
//     //   dateTimeFromControl?.setErrors(err);
//     // }
//     return null;
//   };
// }
