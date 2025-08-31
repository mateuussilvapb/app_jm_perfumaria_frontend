//Angular
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

//Externo
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, finalize } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';

//Interno
import { STATUS } from '@shared/enums/status.enum';
import { SITUACAO } from '@shared/enums/situacao.enum';
import { FormBase } from '@shared/directives/form-base';
import { AutocompleteDto } from '@shared/interfaces/autocomplete-dto';
import { CustomValidators } from '@shared/validators/custom-validators';
import { ProdutoQueryService } from '@produto/service/produto-query.service';
import { EntradaEstoque } from '@entrada-estoque/interfaces/entrada-estoque';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { EntradaEstoqueCreateDto } from '@entrada-estoque/interfaces/entrada-estoque-create-dto';
import { EntradaEstoqueQueryService } from '@entrada-estoque/services/entrada-estoque-query.service';
import { EntradaEstoqueCommandService } from '@entrada-estoque/services/entrada-estoque-command.service';
import { FormControlErrorsComponent } from '@shared/components/form-control-errors/form-control-errors.component';
import { AdicionarProdutoEntradaEstoqueComponent } from '@entrada-estoque/components/adicionar-produto-entrada-estoque/adicionar-produto-entrada-estoque.component';

@Component({
  selector: 'app-entrada-estoque-form',
  imports: [
    //Angular
    FormsModule,
    CommonModule,
    ReactiveFormsModule,

    //Externo
    TagModule,
    CardModule,
    ButtonModule,
    TextareaModule,

    //Interno
    LoadingComponent,
    FormControlErrorsComponent,
    AdicionarProdutoEntradaEstoqueComponent,
  ],
  templateUrl: './entrada-estoque-form.component.html',
})
export class EntradaEstoqueFormComponent extends FormBase implements OnInit {
  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public readonly loadingAutocompleteProdutos$ = new BehaviorSubject<boolean>(false);

  public titleCard: string = '';
  public produtosOptions: AutocompleteDto[] = [];
  public produtosOptionsFinal: AutocompleteDto[] = [];
  public responseEntradaEstoque: Partial<EntradaEstoque>;


  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly location: Location,
    private readonly messageService: MessageService,
    public override readonly activatedRoute: ActivatedRoute,
    private readonly produtoQueryService: ProdutoQueryService,
    private readonly entradaEstoqueQueryService: EntradaEstoqueQueryService,
    private readonly entradaEstoqueCommandService: EntradaEstoqueCommandService,
  ) {
    super(activatedRoute);
  }

  buildForm() {
    this.form = this.fb.group({
      descricao: ['', [Validators.maxLength(1000)]],
      status: [STATUS.ATIVO, Validators.required],
      situacao: [SITUACAO.EM_CADASTRAMENTO, Validators.required],
      produtos: this.fb.array([], CustomValidators.produtosDuplicadosValidator()),
    });
  }

  protected override afterIdentificarTipoRota(): void {
    this.setTitleCard();
  }

  protected override afterBuildForm(): void {
    if (this.isCreate) {
      this.addProduto();
    }
  }

  setTitleCard() {
    if (this.isView) {
      this.titleCard = 'Visualizar Entrada de Estoque';
    } else if (this.isUpdate) {
      this.titleCard = 'Editar Entrada de Estoque';
    } else if (this.isCreate) {
      this.titleCard = 'Criar Entrada de Estoque';
    }
  }

  protected override afterObterIdDaRota(): void {
    this.getAllProdutosAutocomplete();
    if (this.isView || this.isUpdate) {
      this.getData();
    }
  }

  getData() {
    this.loading$.next(true);
    this.entradaEstoqueQueryService
      .byID(this.id)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe((res) => {
        this.responseEntradaEstoque = res;
        this.form.patchValue(res);
      });
  }

  getAllProdutosAutocomplete() {
    this.loadingAutocompleteProdutos$.next(true);
    this.produtoQueryService
      .getAllAutocomplete()
      .pipe(finalize(() => this.loadingAutocompleteProdutos$.next(false)))
      .subscribe((produtos) => {
        this.produtosOptions = produtos;
        this.produtosOptionsFinal = produtos;
    });
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.isCreate) {
      this.create();
    } else if (this.isUpdate) {
      this.update();
    }
  }

  create() {
    if (this.form.valid) {
      this.form.get('situacao').setValue(SITUACAO.CADASTRO_FINALIZADO);
      const dto = new EntradaEstoqueCreateDto(this.form.value);
      this.entradaEstoqueCommandService
        .create(dto)
        .subscribe((res) => {
          if (res) {
            this.messageSuccess();
          }
        });
    }
  }

  update() {
    const entradaEstoqueDTO: Partial<EntradaEstoque> = {
      //TODO: Ajustar
    };
    this.entradaEstoqueCommandService
      .update(this.responseEntradaEstoque.idString, entradaEstoqueDTO)
      .subscribe((res) => {
        if (res) {
          this.messageSuccess();
        }
      });
  }

  messageSuccess() {
    const message = this.isCreate
      ? 'Entrada de estoque criada com sucesso!\nVocê será redirecionado.'
      : 'Entrada de estoque alterada com sucesso!\nVocê será redirecionado.';
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: message,
      life: 5000,
    });
    this.router.navigate(['/entrada-estoque']);
  }

  onVoltar() {
    if (window.history.length > 1) {
      // Existe histórico, pode voltar
      this.location.back();
    } else {
      // Não há histórico, redireciona manualmente
      this.router.navigate(['/entrada-estoque']);
    }
  }

  get produtosFormArray(): FormArray {
    return (this.form?.get('produtos') as FormArray) || this.fb.array([]);
  }

  getProdutoFormGroup(i: number): FormGroup {
    return this.produtosFormArray.at(i) as FormGroup;
  }

  createProdutoToFormArray(): FormGroup {
    return this.fb.group({
      idProduto: [null, Validators.required],
      precoUnitario: [null, [Validators.required, Validators.min(0.01)]],
      quantidade: [null, [Validators.required, Validators.min(1)]],
      status: [STATUS.ATIVO, Validators.required],
      desconto: [null],
    });
  }

  addProduto() {
    this.produtosFormArray.push(this.createProdutoToFormArray());
  }

  removeProduto(index: number) {
    this.produtosFormArray.removeAt(index);
  }

  get podeRemoverProduto(): boolean {
    return this.produtosFormArray.length > 1 && !this.isView;
  }
}
