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

  static produtosDuplicadosValidator(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      if (!formArray?.value || !Array.isArray(formArray.value)) {
        return null;
      }

      const ids = formArray.value
        .map((produto: any) => produto.idProduto)
        .filter((id: any) => id != null); // ignora se ainda não escolheu produto

      const hasDuplicate = ids.some(
        (id, index) => ids.indexOf(id) !== index
      );

      return hasDuplicate ? { produtosDuplicados: true } : null;
    };
  }
}
