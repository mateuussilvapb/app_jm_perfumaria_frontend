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
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, finalize } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmationService, MessageService } from 'primeng/api';

//Interno
import { Utils } from '@utils/utils';
import { STATUS } from '@shared/enums/status.enum';
import { SITUACAO } from '@shared/enums/situacao.enum';
import { FormBase } from '@shared/directives/form-base';
import { CustomValidators } from '@shared/validators/custom-validators';
import { ProdutoQueryService } from '@produto/service/produto-query.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { SaidaEstoqueQueryService } from '@saida-estoque/services/saida-estoque-query.service';
import { MovimentacaoEstoqueCreateDto } from '@shared/interfaces/movimentacao-estoque-create-dto';
import { SaidaEstoqueCommandService } from '@saida-estoque/services/saida-estoque-command.service';
import { MovimentacaoEstoqueViewUpdateDto } from '@shared/interfaces/movimentacao-estoque-view-update-dto';
import { ProdutoMovimentacaoAutocompleteDto } from '@produto/interfaces/produto-movimentacao-autocomplete-dto';
import { ProdutoMovimentacaoEstoqueCreateDto } from '@shared/interfaces/produto-movimentacao-estoque-create-dto';
import { FormControlErrorsComponent } from '@shared/components/form-control-errors/form-control-errors.component';
import { AdicionarProdutoSaidaEstoqueComponent } from '@saida-estoque/components/adicionar-produto-saida-estoque/adicionar-produto-saida-estoque.component';
import { ListaProdutosSaidaEstoqueToAddComponent } from '@saida-estoque/components/lista-produtos-saida-estoque-to-add/lista-produtos-saida-estoque-to-add.component';

@Component({
  selector: 'app-saida-estoque-form',
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
    DatePickerModule,

    //Interno
    LoadingComponent,
    FormControlErrorsComponent,
    AdicionarProdutoSaidaEstoqueComponent,
    ListaProdutosSaidaEstoqueToAddComponent,
  ],
  templateUrl: './saida-estoque-form.component.html',
})
export class SaidaEstoqueFormComponent extends FormBase implements OnInit {
  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public readonly loadingAutocompleteProdutos$ = new BehaviorSubject<boolean>(false);

  public titleCard: string = '';
  public maxDate: Date | undefined;
  public produtoToEdit: any = null;
  public readonly SITUACAO = SITUACAO;
  public produtosOptions: ProdutoMovimentacaoAutocompleteDto[] = [];
  public responseSaidaEstoque: Partial<MovimentacaoEstoqueViewUpdateDto>;
  public produtosList: Array<Partial<ProdutoMovimentacaoEstoqueCreateDto>> = [];

  constructor(
    private readonly fb: FormBuilder,
    protected override location: Location,
    protected override readonly router: Router,
    private readonly messageService: MessageService,
    public override readonly activatedRoute: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
    private readonly produtoQueryService: ProdutoQueryService,
    private readonly saidaEstoqueQueryService: SaidaEstoqueQueryService,
    private readonly saidaEstoqueCommandService: SaidaEstoqueCommandService
  ) {
    super(router, location, '/saida-estoque', activatedRoute);
  }

  buildForm() {
    this.form = this.fb.group({
      descricao: ['', [Validators.maxLength(1000)]],
      status: [STATUS.ATIVO, Validators.required],
      situacao: [SITUACAO.EM_CADASTRAMENTO, Validators.required],
      dataMovimentacaoEstoque: [null, [Validators.required]],
      produtos: this.fb.array(
        [],
        [CustomValidators.produtosDuplicadosValidator()]
      ),
    });
  }

  protected override afterIdentificarTipoRota(): void {
    this.setTitleCard();
    this.getAllProdutosAutocomplete();
  }

  protected override afterBuildForm(): void {
    this.definirDataMaxima();
  }

  setTitleCard() {
    if (this.isView) {
      this.titleCard = 'Visualizar Saida de Estoque';
    } else if (this.isUpdate) {
      this.titleCard = 'Editar Saida de Estoque';
    } else if (this.isCreate) {
      this.titleCard = 'Criar Saida de Estoque';
    }
  }

  protected override afterObterIdDaRota(): void {
    if (this.isView || this.isUpdate) {
      this.getData();
    }
  }

  getData() {
    this.loading$.next(true);
    this.saidaEstoqueQueryService
      .getById(this.id)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe((res) => {
        this.responseSaidaEstoque = res;
        this.form.patchValue(res);
        this.adicionarProdutosResponseNoArray();
      });
  }

  adicionarProdutosResponseNoArray() {
    if (
      this.responseSaidaEstoque.movimentacaoProdutos &&
      this.responseSaidaEstoque.movimentacaoProdutos.length > 0
    ) {
      this.responseSaidaEstoque.movimentacaoProdutos.forEach((p) => {
        this.produtosList.push({
          idProduto: p.produto.id,
          precoUnitario: p.precoUnitario,
          quantidade: p.quantidade,
          desconto: p.desconto,
          status: p.status,
        });
      });
    }
  }

  onSubmit(event, isRascunho: boolean = false) {
    event.preventDefault();
    if (this.form.valid && this.produtosList.length > 0) {
      this.addProdutosOnFormArray();
      this.setSituacaoOnForm(isRascunho);
      const dto = new MovimentacaoEstoqueCreateDto(this.form.value);
      if (this.isCreate) {
        this.create(dto);
      } else if (this.isUpdate) {
        this.update(dto);
      }
    }
  }

  setSituacaoOnForm(isRascunho: boolean) {
    this.form
      .get('situacao')
      .setValue(
        isRascunho ? SITUACAO.EM_CADASTRAMENTO : SITUACAO.CADASTRO_FINALIZADO
      );
  }

  create(dto: MovimentacaoEstoqueCreateDto) {
    if (this.form.valid && this.produtosList.length > 0) {
      this.saidaEstoqueCommandService.create(dto).subscribe((res) => {
        if (res) {
          this.messageSuccess();
        }
      });
    }
  }

  update(dto: MovimentacaoEstoqueCreateDto) {
    if (this.form.valid && this.produtosList.length > 0) {
      this.saidaEstoqueCommandService
        .update(this.responseSaidaEstoque.idString, dto)
        .subscribe((res) => {
          if (res) {
            this.messageSuccess();
          }
        });
    }
  }

  messageSuccess() {
    const message = this.isCreate
      ? 'Saida de estoque criada com sucesso!\nVocê será redirecionado.'
      : 'Saida de estoque alterada com sucesso!\nVocê será redirecionado.';
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: message,
      life: 5000,
    });
    this.router.navigate(['/saida-estoque']);
  }

  voltar() {
    if (this.produtosList.length > 0 && !this.isView) {
      this.confirmarNavegacaoVoltar();
    } else {
      this.onVoltar();
    }
  }

  get produtosFormArray(): FormArray {
    return (this.form?.get('produtos') as FormArray) || this.fb.array([]);
  }

  getProdutoFormGroup(i: number): FormGroup {
    return this.produtosFormArray.at(i) as FormGroup;
  }

  createProdutoToFormArray(
    produto: Partial<ProdutoMovimentacaoEstoqueCreateDto>
  ): FormGroup {
    return this.fb.group({
      idProduto: [produto.idProduto, Validators.required],
      precoUnitario: [
        produto.precoUnitario,
        [Validators.required, Validators.min(0.01)],
      ],
      quantidade: [
        produto.quantidade,
        [Validators.required, Validators.min(1)],
      ],
      status: [STATUS.ATIVO, Validators.required],
      desconto: [produto.desconto],
    });
  }

  addProdutosOnFormArray() {
    this.produtosFormArray.clear();
    this.produtosList.forEach((p) => {
      this.produtosFormArray.push(this.createProdutoToFormArray(p));
    });
  }

  addProdutoOnProdutosList(event) {
    if (this.validadeProdutoAlreadyAdded(event.idProduto)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail:
          'Produto já adicionado na lista.\nVerifique os produtos adicionados.',
        life: 5000,
      });
      return;
    }
    if (event && this.validadeProdutoCanAdd(event)) {
      this.produtosList.push(event);
    }
  }

  onEditProdutoInList(event: any) {
    const produto = this.produtosList.find((p) => p.idProduto === event);
    if (produto) {
      if (typeof produto.desconto === 'number') {
        const descontoPresenter = (produto.desconto * 100).toFixed(2);
        produto.desconto = `${descontoPresenter} %`;
      }
      this.produtoToEdit = { ...produto };
      this.produtoToEdit.status = STATUS.ATIVO;
      this.onRemoveInProduto(event);
    }
  }

  onRemoveInProduto(event: any) {
    if (event) {
      this.produtosList = this.produtosList.filter(
        (p) => p.idProduto !== event
      );
    }
  }

  getAllProdutosAutocomplete() {
    this.loadingAutocompleteProdutos$.next(true);
    this.produtoQueryService
      .getAllAutocompletMovimentacao()
      .pipe(finalize(() => this.loadingAutocompleteProdutos$.next(false)))
      .subscribe((produtos) => {
        this.produtosOptions = produtos;
      });
  }

  confirmarNavegacaoVoltar() {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja sair? As alterações não salvas serão perdidas.`,
      header: 'Confirma?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.onVoltar(),
    });
  }

  validadeProdutoCanAdd(
    produto: Partial<ProdutoMovimentacaoEstoqueCreateDto>
  ): boolean {
    for (const key of Object.keys(produto)) {
      if (key !== 'desconto' && key !== 'status') {
        if (
          produto[key] === null ||
          produto[key] === undefined ||
          produto[key] === ''
        ) {
          return false;
        }
      }
    }
    return true;
  }

  validadeProdutoAlreadyAdded(idProduto: string): boolean {
    return this.produtosList.some((p) => p.idProduto === idProduto);
  }

  getSituacaoNormalized(situacao: SITUACAO) {
    return Utils.getSituacaoNormalized(situacao);
  }

  definirDataMaxima() {
    this.maxDate = new Date();
    if (this.isCreate) {
      this.form.get('dataMovimentacaoEstoque')?.setValue(this.maxDate);
    }
  }
}
