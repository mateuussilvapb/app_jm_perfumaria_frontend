//Angular
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

//Externos
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, finalize } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';

//Internos
import { FormBase } from '@shared/directives/form-base';
import { CategoriaQueryService } from '@categoria/service/categoria-query.service';
import { CategoriaCommandService } from '@categoria/service/categoria-command.service';
import { FormControlErrorsComponent } from '@shared/components/form-control-errors/form-control-errors.component';
import { Categoria } from '@categoria/interfaces/categoria';
import { MessageService } from 'primeng/api';
import { CategoriaUpdateDTO } from '@categoria/interfaces/categoria-update-dto';

@Component({
  selector: 'app-categoria-form',
  imports: [
    //Angular
    FormsModule,
    CommonModule,
    ReactiveFormsModule,

    //Externos
    CardModule,
    ButtonModule,
    TextareaModule,
    InputTextModule,

    //Internos
    FormControlErrorsComponent,
  ],
  templateUrl: './categoria-form.component.html',
})
export class CategoriaFormComponent extends FormBase implements OnInit {
  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public titleCard: string = '';
  public responseCategoria: Categoria;

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly location: Location,
    private readonly messageService: MessageService,
    public override readonly activatedRoute: ActivatedRoute,
    private readonly categoriaQueryService: CategoriaQueryService,
    private readonly categoriaCommandService: CategoriaCommandService
  ) {
    super(activatedRoute);
  }

  buildForm() {
    this.form = this.fb.group({
      nome: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
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

  getData() {
    this.loading$.next(true);
    this.categoriaQueryService
      .byID(this.id)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe((res) => {
        this.responseCategoria = res;
        this.form.patchValue(res);
      });
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.isCreate) {
      this.createCategoria();
    } else if (this.isUpdate) {
      this.updateCategoria();
    }
  }

  createCategoria() {
    this.categoriaCommandService.create(this.form.value).subscribe((res) => {
      if (res) {
        this.messageSuccess();
      }
    });
  }

  updateCategoria() {
    const categoriaDTO: CategoriaUpdateDTO = {
      id: this.responseCategoria.idString,
      nome: this.form.value.nome,
      descricao: this.form.value.descricao,
      status: this.responseCategoria.status,
    };
    this.categoriaCommandService
      .update(this.responseCategoria.idString, categoriaDTO)
      .subscribe((res) => {
        if (res) {
          this.messageSuccess();
        }
      });
  }

  messageSuccess() {
    const message = this.isCreate
      ? 'Categoria criada com sucesso!\nVocê será redirecionado.'
      : 'Categoria alterada com sucesso!\nVocê será redirecionado.';
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: message,
      life: 5000,
    });
    this.router.navigate(['/categoria']);
  }

  onVoltar() {
    if (window.history.length > 1) {
      // Existe histórico, pode voltar
      this.location.back();
    } else {
      // Não há histórico, redireciona manualmente
      this.router.navigate(['/categoria']);
    }
  }
}
