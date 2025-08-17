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
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { BehaviorSubject, finalize, Observable } from 'rxjs';

//Internos
import { STATUS } from '@shared/enums/status.enum';
import { Produto } from '@produto/interfaces/produto';
import { FormBase } from '@shared/directives/form-base';
import { ProdutoDto } from '@produto/interfaces/produto-dto';
import { MarcaQueryService } from '@marca/service/marca-query.service';
import { ProdutoUpdateDTO } from '@produto/interfaces/produto-update-dto';
import { ProdutoQueryService } from '@produto/service/produto-query.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ProdutoCommandService } from '@produto/service/produto-command.service';
import { CategoriaQueryService } from '@categoria/service/categoria-query.service';
import { FormControlErrorsComponent } from '@shared/components/form-control-errors/form-control-errors.component';

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
    SelectModule,
    TagModule,

    //Internos
    LoadingComponent,
    FormControlErrorsComponent,
  ],
  templateUrl: './produto-form.component.html',
})
export class ProdutoFormComponent extends FormBase implements OnInit {
  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public readonly loadingAutocompleteMarca$ = new BehaviorSubject<boolean>(
    false
  );
  public readonly loadingAutocompleteCategoria$ = new BehaviorSubject<boolean>(
    false
  );
  public readonly onCreateUpdate$ = new BehaviorSubject<boolean>(false);

  public titleCard: string = '';
  public responseProduto: Produto;
  public marcaOptions: { label: string; value: string }[] = [];
  public categoriaOptions: { label: string; value: string }[] = [];

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

  buildForm(): void {
    this.form = this.fb.group({
      nome: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      descricao: ['', [Validators.maxLength(1000)]],
      precoCusto: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(9999999999.99),
        ],
      ],
      precoVenda: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(9999999999.99),
        ],
      ],
      idMarca: [null, [Validators.required]],
      idCategoria: [null, [Validators.required]],
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
    this.getAllMarcasAutocomplete();
    this.getAllCategoriasAutocomplete();
    if (this.isView || this.isUpdate) {
      this.getData();
    }
  }

  getData() {
    this.loading$.next(true);
    this.produtoQueryService
      .byID(this.id)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe((res) => {
        this.responseProduto = res;
        this.form.patchValue(res);
        this.form.patchValue({ idMarca: res.marca.idString });
        this.form.patchValue({ idCategoria: res.categoria.idString });
      });
  }

  getAllMarcasAutocomplete() {
    this.loadingAutocompleteMarca$.next(true);
    this.marcaQueryService
      .getAllAutocomplete()
      .pipe(finalize(() => this.loadingAutocompleteMarca$.next(false)))
      .subscribe((marcas) => {
        marcas.forEach((m) => {
          if (m.nome !== 'Sem marca') {
            this.marcaOptions.push({
              label: m.nome,
              value: m.id,
            });
          }
        });
      });
  }

  getAllCategoriasAutocomplete() {
    this.loadingAutocompleteCategoria$.next(true);
    this.categoriaQueryService
      .getAllAutocomplete()
      .pipe(finalize(() => this.loadingAutocompleteCategoria$.next(false)))
      .subscribe((categorias) => {
        categorias.forEach((m) => {
          if (m.nome !== 'Sem categoria') {
            this.categoriaOptions.push({
              label: m.nome,
              value: m.id,
            });
          }
        });
      });
  }

  onSubmit(event) {
    if (this.form.valid) {
      this.onCreateUpdate$.next(true);
      event.preventDefault();
      let subscribe: Observable<any>;
      if (this.isCreate) {
        subscribe = this.createProduto();
      } else if (this.isUpdate) {
        subscribe = this.updateProduto();
      }
      this.onSubscribe(subscribe);
    }
  }

  createProduto() {
    const dto: ProdutoDto = {
      nome: this.form?.value?.nome ?? '',
      descricao: this.form?.value?.descricao ?? '',
      idCategoria: this.form?.value?.idCategoria ?? '',
      idMarca: this.form?.value?.idMarca ?? '',
      precoCusto: this.form?.value?.precoCusto ?? '',
      precoVenda: this.form?.value?.precoVenda ?? '',
      status: STATUS.ATIVO,
    };
    return this.produtoCommandService.create(dto);
  }

  updateProduto() {
    const produtoDTO: ProdutoUpdateDTO = {
      id: this.responseProduto?.idString,
      nome: this.form?.value?.nome ?? '',
      descricao: this.form?.value?.descricao ?? '',
      precoCusto: this.form?.value?.precoCusto ?? '',
      precoVenda: this.form?.value?.precoVenda ?? '',
      idCategoria: this.form?.value?.idCategoria ?? '',
      idMarca: this.form?.value?.idMarca ?? '',
      status: this.responseProduto?.status ?? STATUS.ATIVO,
    };
    return this.produtoCommandService.update(
      this.responseProduto.idString,
      produtoDTO
    );
  }

  onSubscribe(subscribe: Observable<any>) {
    subscribe.pipe(finalize(() => this.onCreateUpdate$.next(false))).subscribe({
      next: () => this.messageSuccess(),
      error: () => {
        this.router.navigate(['/usuario']);
      },
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
