import { AbstractControl, ValidationErrors } from "@angular/forms";

export const dateInPastValidator = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;

  const dateInPast = new Date(control?.value).getTime() < new Date().getTime();

  return dateInPast ? { dateInPast: { value: `${control.value} liegt in der Vergangenheit!` } } : null;
};
