//Angular
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

//Externos
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, finalize } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';

//Internos
import { Marca } from '@marca/interfaces/marca';
import { FormBase } from '@shared/directives/form-base';
import { MarcaUpdateDTO } from '@marca/interfaces/marca-update-dto';
import { MarcaQueryService } from '@marca/service/marca-query.service';
import { MarcaCommandService } from '@marca/service/marca-command.service';
import { FormControlErrorsComponent } from '@shared/components/form-control-errors/form-control-errors.component';

@Component({
  selector: 'app-marca-form',
  imports: [
    //Angular
    FormsModule,
    CommonModule,
    ReactiveFormsModule,

    //Externos
    TagModule,
    CardModule,
    ButtonModule,
    TextareaModule,
    InputTextModule,

    //Internos
    FormControlErrorsComponent,
  ],
  templateUrl: './marca-form.component.html',
})
export class MarcaFormComponent extends FormBase implements OnInit {
  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public titleCard: string = '';
  public responseMarca: Marca;

  constructor(
    private readonly fb: FormBuilder,
    protected override readonly router: Router,
    protected override readonly location: Location,
    private readonly messageService: MessageService,
    public override readonly activatedRoute: ActivatedRoute,
    private readonly marcaQueryService: MarcaQueryService,
    private readonly marcaCommandService: MarcaCommandService
  ) {
    super(router, location, '/marca', activatedRoute);
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
      descricao: ['', [Validators.maxLength(1000)]],
    });
  }

  protected override afterIdentificarTipoRota(): void {
    this.setTitleCard();
  }

  setTitleCard() {
    if (this.isView) {
      this.titleCard = 'Visualizar Marca';
    } else if (this.isUpdate) {
      this.titleCard = 'Editar Marca';
    } else if (this.isCreate) {
      this.titleCard = 'Criar Marca';
    }
  }

  protected override afterObterIdDaRota(): void {
    if (this.isView || this.isUpdate) {
      this.getData();
    }
  }

  getData() {
    this.loading$.next(true);
    this.marcaQueryService
      .byID(this.id)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe((res) => {
        this.responseMarca = res;
        this.form.patchValue(res);
      });
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.isCreate) {
      this.createMarca();
    } else if (this.isUpdate) {
      this.updateMarca();
    }
  }

  createMarca() {
    this.marcaCommandService.create(this.form.value).subscribe((res) => {
      if (res) {
        this.messageSuccess();
      }
    });
  }

  updateMarca() {
    const marcaDTO: MarcaUpdateDTO = {
      id: this.responseMarca.idString,
      nome: this.form.value.nome,
      descricao: this.form.value.descricao,
      status: this.responseMarca.status,
    };
    this.marcaCommandService
      .update(this.responseMarca.idString, marcaDTO)
      .subscribe((res) => {
        if (res) {
          this.messageSuccess();
        }
      });
  }

  messageSuccess() {
    const message = this.isCreate
      ? 'Marca criada com sucesso!\nVocê será redirecionado.'
      : 'Marca alterada com sucesso!\nVocê será redirecionado.';
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: message,
      life: 5000,
    });
    this.router.navigate(['/marca']);
  }
}
