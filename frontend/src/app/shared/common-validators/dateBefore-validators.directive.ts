import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateBeforeValidator(
  dateTimeFromFieldName: string,
  dateTimeToFieldName: string,
): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const dateTimeFromControl = form.get(dateTimeFromFieldName);
    const dateTimeToControl = form.get(dateTimeToFieldName);

    if (!dateTimeFromControl || !dateTimeToControl || (dateTimeToControl.pristine && dateTimeFromControl.pristine)) return null;

    dateTimeFromControl?.setErrors(null);
    dateTimeToControl?.setErrors(null);

    if (new Date(form.get(dateTimeToFieldName)?.value) < new Date(dateTimeFromControl?.value)) {
      const msg = { value: 'Bitte korrekten Zeitraum wählen. Von-Datum vor Bis-Datum.' };
      const err = { dateBeforeValidator: msg };
      dateTimeFromControl?.setErrors(err);
      return { dateTimeFromFieldName: { value: true } };
    }
    return null;
  };
}
