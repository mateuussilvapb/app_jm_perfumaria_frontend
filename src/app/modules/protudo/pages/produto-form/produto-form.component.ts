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
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, finalize } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';

//Internos
import { FormBase } from '@shared/directives/form-base';
import { Produto } from '../../interfaces/produto';
import { FormControlErrorsComponent } from '@shared/components/form-control-errors/form-control-errors.component';
import { ProdutoQueryService } from '../../service/produto-query.service';
import { ProdutoCommandService } from '../../service/produto-command.service';
import { ProdutoUpdateDTO } from '../../interfaces/produto-update-dto';
import { DropdownModule } from 'primeng/dropdown';
import { MarcaQueryService } from 'app/modules/marca/service/marca-query.service';
import { CategoriaQueryService } from '@categoria/service/categoria-query.service';

@Component({
  selector: 'app-produto-form',
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
    DropdownModule,

    //Internos
    FormControlErrorsComponent,
  ],
  templateUrl: './produto-form.component.html',
})
export class ProdutoFormComponent extends FormBase implements OnInit {
  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public titleCard: string = '';
  public responseProduto: Produto;
  public marcaOptions: { label: string; value: number }[] = [];
  public categoriaOptions: { label: string; value: number }[] = [];
  public statusOptions = [
    { label: 'Ativo', value: 'ATIVO' },
    { label: 'Inativo', value: 'INATIVO' },
  ];

  public situacaoOptions = [
    { label: 'Em cadastramento', value: 'EM_CADASTRAMENTO' },
    { label: 'Cadastrado', value: 'CADASTRO_FINALIZADO' },
  ];

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly location: Location,
    private readonly messageService: MessageService,
    public override readonly activatedRoute: ActivatedRoute,
    private readonly produtoQueryService: ProdutoQueryService,
    private readonly marcaQueryService: MarcaQueryService,
    private readonly categoriaQueryService: CategoriaQueryService,
    private readonly produtoCommandService: ProdutoCommandService
  ) {
    super(activatedRoute);
  }

  override afterBuildForm(): void {
    this.getMarcaData();
    this.getCategoriaData();
  }

  buildForm(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      precoCusto: [null, Validators.required],
      precoVenda: [null, Validators.required],
      status: ['ATIVO', Validators.required],
      situacao: ['EM_CADASTRAMENTO', Validators.required]
    });
  }

  protected override afterIdentificarTipoRota(): void {
    this.setTitleCard();
  }

  setTitleCard() {
    if (this.isView) {
      this.titleCard = 'Visualizar Produto';
    } else if (this.isUpdate) {
      this.titleCard = 'Editar Produto';
    } else if (this.isCreate) {
      this.titleCard = 'Criar Produto';
    }
  }

  protected override afterObterIdDaRota(): void {
    if (this.isView || this.isUpdate) {
      this.getData();
    }
  }

  getStatusLabel(status: string): string {
    const found = this.statusOptions.find((opt) => opt.value === status);
    return found ? found.label : '';
  }

  getSituacaoLabel(situacao: string): string {
    const found = this.situacaoOptions.find((opt) => opt.value === situacao);
    return found ? found.label : '';
  }

  getData() {
    this.loading$.next(true);
    this.produtoQueryService
      .byID(this.id)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe((res) => {
        this.responseProduto = res;
        this.form.patchValue(res);
      });
  }

  getMarcaData() {
    this.loading$.next(true);
    this.marcaQueryService
      .all()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe(marcas => {
        this.marcaOptions = marcas.map((m) => ({
          label: m.nome,
          value: m.id,
        }));
      });
  }

  getCategoriaData() {
    this.loading$.next(true);
    this.categoriaQueryService
      .all()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe((categorias) => {
        this.categoriaOptions = categorias.map((m) => ({
          label: m.nome,
          value: m.id,
        }));
      });
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.isCreate) {
      this.createProduto();
    } else if (this.isUpdate) {
      this.updateProduto();
    }
  }

  createProduto() {
    this.produtoCommandService.create(this.form.value).subscribe((res) => {
      if (res) {
        this.messageSuccess();
      }
    });
  }

  updateProduto() {
    const produtoDTO: ProdutoUpdateDTO = {
      id: this.responseProduto.idString,
      nome: this.form.value.nome,
      descricao: this.form.value.descricao,
      status: this.responseProduto.status,
    };
    this.produtoCommandService
      .update(this.responseProduto.idString, produtoDTO)
      .subscribe((res) => {
        if (res) {
          this.messageSuccess();
        }
      });
  }

  messageSuccess() {
    const message = this.isCreate
      ? 'Produto criado com sucesso!\nVocê será redirecionado.'
      : 'Produto alterado com sucesso!\nVocê será redirecionado.';
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: message,
      life: 5000,
    });
    this.router.navigate(['/produto']);
  }

  onVoltar() {
    if (window.history.length > 1) {
      // Existe histórico, pode voltar
      this.location.back();
    } else {
      // Não há histórico, redireciona manualmente
      this.router.navigate(['/produto']);
    }
  }
}
