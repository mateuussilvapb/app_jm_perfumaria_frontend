import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static lettersAndNumbersPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) return null;

      const hasLetter = /[a-zA-Z]/.test(value);
      const hasNumber = /\d/.test(value);

      const valid = hasLetter && hasNumber;

      return valid ? null : { lettersAndNumbers: true };
    };
  }

}
