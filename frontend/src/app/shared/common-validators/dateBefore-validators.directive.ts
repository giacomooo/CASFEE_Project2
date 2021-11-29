import {  AbstractControl, FormGroup, ValidatorFn } from "@angular/forms";

export function dateBeforeValidator (dateTimeFrom: string, secondDate: string): ValidatorFn {

  return (form: AbstractControl ): { [key: string]: boolean } | null => {

    const firstDateValue = form.get(dateTimeFrom)?.value;
    const secondDateValue = form.get(secondDate)?.value;

    if (!firstDateValue) return null;

    console.log("2tut", firstDateValue, secondDateValue);
     console.log(new Date (secondDateValue));

    if (!firstDateValue || !secondDateValue){
      return { missing: true };
    }

    const firstDate = new Date(firstDateValue);

    const err = { dateBeforeValidator: true};
    form.get(dateTimeFrom)?.setErrors(err);

    return null;
  };
}
