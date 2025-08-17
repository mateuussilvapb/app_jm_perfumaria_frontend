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

  static noSpacesAndSpecialCharacters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) return null;

      const hasSpaces = /\s/.test(value);
      const hasInvalidChars = /[^a-zA-Z0-9_-]/.test(value);

      const valid = !hasSpaces && !hasInvalidChars;

      return valid ? null : { specialCharacters: true };
    };
  }
}
