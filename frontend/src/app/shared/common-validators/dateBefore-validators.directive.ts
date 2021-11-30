import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateBeforeValidator(
  dateTimeFromFieldName: string,
  dateTimeToFieldName: string
): ValidatorFn {
  return (form: AbstractControl): { [key: string]: boolean } | null => {
    const dateTimeFromControl = form.get(dateTimeFromFieldName);

    if (!dateTimeFromControl) return null;

    const firstDateValue = new Date(dateTimeFromControl?.value);
    const secondDateValue = new Date(form.get(dateTimeToFieldName)?.value);

    dateTimeFromControl?.setErrors(null);

    if (!firstDateValue || !secondDateValue) return null;

    if (secondDateValue < firstDateValue) {
      const msg = {value: "Bitte korrekten Zeitraum wählen."};
      const err = { dateBeforeValidator: msg  };
      dateTimeFromControl?.setErrors(err);
    }
    return null;
  };
}
