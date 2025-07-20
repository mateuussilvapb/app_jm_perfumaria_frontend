//Angular
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

//Externos
import { CardModule } from 'primeng/card';
import { BehaviorSubject, finalize } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';

//Internos
import { FormBase } from '@shared/directives/form-base';
import { CategoriaQueryService } from '@categoria/service/categoria-query.service';
import { CategoriaCommandService } from '@categoria/service/categoria-command.service';
import { FormControlErrorsComponent } from '@shared/components/form-control-errors/form-control-errors.component';

@Component({
  selector: 'app-categoria-form',
  imports: [
    //Angular
    FormsModule,
    CommonModule,
    ReactiveFormsModule,

    //Externos
    CardModule,
    TextareaModule,
    InputTextModule,

    //Internos
    FormControlErrorsComponent
  ],
  templateUrl: './categoria-form.component.html',
})
export class CategoriaFormComponent extends FormBase implements OnInit {
  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public titleCard: string = "";

  constructor(
    private readonly fb: FormBuilder,
    public override readonly activatedRoute: ActivatedRoute,
    private readonly categoriaQueryService: CategoriaQueryService,
    private readonly categoriaCommandService: CategoriaCommandService,
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

  protected override afterObterIdDaRota(): void {
    if (this.isView || this.isUpdate) {
      this.getData();
    }
  }

  onSubmit(event) {
    event.preventDefault();
  }

  getData() {
    this.loading$.next(true);
    this.categoriaQueryService.byID(this.id)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe(res => {
        this.form.patchValue(res);
      });
  }

}
