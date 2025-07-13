//Angular
import { CommonModule } from '@angular/common';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ChangeDetectorRef, Component, Input } from '@angular/core';

//Externos
import { filter, map, Observable, startWith, tap } from 'rxjs';

//Internos
import { errorMessagesDictionary } from './errors';

@Component({
  selector: 'app-form-control-errors',
  imports: [CommonModule],
  template: `
    @if(errorMessages$ | async; as errorMessages){
    <div>
      <ul
        class="text-sm m-0 text-red-600 p-0 list-none	mt-1"
        [hidden]="!errorMessages || errorMessages.length === 0"
      >
        @for(message of errorMessages; track message){
        <li class="list-none">
          {{ message }}
        </li>
        }
      </ul>
    </div>
    }
  `,
})
export class FormControlErrorsComponent {
  errorMessages$: Observable<string[]>;

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  @Input()
  public set control(control: AbstractControl) {
    this.errorMessages$ = control.valueChanges.pipe(
      startWith(control.errors),
      filter(() => control.dirty),
      map(() => this.map(control.errors)),
      tap(() => this.cdRef.markForCheck())
    );
  }

  private readonly map = (errors: ValidationErrors) =>
    errors
      ? Object.keys(errors).map((key) => this.translate(key, errors[key]))
      : [];

  private readonly translate = (key, value) => {
    const translationFn =
      errorMessagesDictionary[key] ||
      (() => `Campo inválido: ${key} - ${value}`);
    return translationFn(value);
  };
}
