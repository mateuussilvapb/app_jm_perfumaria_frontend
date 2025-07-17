//Angular
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

//Externos
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { BehaviorSubject, map, startWith } from 'rxjs';
import { RadioButtonModule } from 'primeng/radiobutton';

//Internos
import { STATUS } from '@shared/enums/status.enum';

@Component({
  selector: 'app-categoria-filters',
  imports: [
    //Angular
    FormsModule,
    CommonModule,
    ReactiveFormsModule,

    //Externos
    CardModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    RadioButtonModule,
  ],
  templateUrl: './categoria-filters.component.html',
})
export class CategoriaFiltersComponent implements OnInit {
  @Input() refresh$: BehaviorSubject<boolean>;
  @Output() onFilter = new EventEmitter<any>();

  form: FormGroup;
  statusSelect: { key: string; value: string }[] = [
    {
      key: STATUS.ATIVO,
      value: 'Ativo',
    },
    {
      key: STATUS.INATIVO,
      value: 'Inativo',
    },
  ];

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();

    this.refresh$
      .pipe(
        startWith(undefined),
        map(() => {
          this.form.reset();
        })
      )
      .subscribe();
  }

  createForm() {
    this.form = this.fb.group({
      nome: [null],
      status: [null],
    });
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && control.touched;
  }

  onSubmit() {
    this.onFilter.emit(this.form.value);
  }

  limparCampos() {
    this.form.reset();
    this.onFilter.emit();
  }

  disableButtonBuscar() {
    let disable = true;
    Object.keys(this.form.controls).forEach((controlName) => {
      if (
        this.form.get(controlName)?.value &&
        this.form.get(controlName)?.value != ''
      ) {
        disable = false;
      }
    });
    return disable;
  }
}
