//Angular
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

//Externos
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

//Internos
import { FormBase } from '@shared/directives/form-base';
import { FormControlErrorsComponent } from '@shared/components/form-control-errors/form-control-errors.component';

@Component({
  selector: 'app-categoria-form',
  imports: [
    //Angular
    FormsModule,
    ReactiveFormsModule,

    //Externos
    CardModule,
    InputTextModule,

    //Internos
    FormControlErrorsComponent
  ],
  templateUrl: './categoria-form.component.html',
})
export class CategoriaFormComponent extends FormBase implements OnInit {
  public titleCard: string = "";

  constructor(
    private readonly fb: FormBuilder,
    public override readonly activatedRoute: ActivatedRoute
  ) {
    super(activatedRoute);
  }

  buildForm() {
    this.form = this.fb.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      status: [null],
      descricao: [null, [Validators.maxLength(1000)]],
    });
  }

  protected override afterIdentificarTipoRota(): void {
    this.setTitleCard();
  }

  setTitleCard() {
    if (this.isView) {
      this.titleCard = 'Visualizar Categoria';
    } else if (this.isUpdate) {
      this.titleCard = 'Editar Categoria';
    } else if (this.isCreate) {
      this.titleCard = 'Criar Categoria';
    }
  }

  onSubmit(event) {
    event.preventDefault();
  }

}
