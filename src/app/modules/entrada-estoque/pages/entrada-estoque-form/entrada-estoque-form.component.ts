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
import { ConfirmationService, MessageService } from 'primeng/api';

//Interno
import { Utils } from '@utils/utils';
import { STATUS } from '@shared/enums/status.enum';
import { SITUACAO } from '@shared/enums/situacao.enum';
import { FormBase } from '@shared/directives/form-base';
import { AutocompleteDto } from '@shared/interfaces/autocomplete-dto';
import { CustomValidators } from '@shared/validators/custom-validators';
import { ProdutoQueryService } from '@produto/service/produto-query.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { EntradaEstoqueCreateDto } from '@entrada-estoque/interfaces/entrada-estoque-create-dto';
import { EntradaEstoqueQueryService } from '@entrada-estoque/services/entrada-estoque-query.service';
import { EntradaEstoqueCommandService } from '@entrada-estoque/services/entrada-estoque-command.service';
import { EntradaEstoqueViewUpdateDto } from '@entrada-estoque/interfaces/entrada-estoque-view-update-dto';
import { FormControlErrorsComponent } from '@shared/components/form-control-errors/form-control-errors.component';
import { ProdutoEntradaEstoqueCreateDto } from '@produto-entrada-estoque/interfaces/produto-entrada-estoque-create-dto';
import { AdicionarProdutoEntradaEstoqueComponent } from '@entrada-estoque/components/adicionar-produto-entrada-estoque/adicionar-produto-entrada-estoque.component';
import { ListaProdutosEntradaEstoqueToAddComponent } from '@entrada-estoque/components/lista-produtos-entrada-estoque-to-add/lista-produtos-entrada-estoque-to-add.component';

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
    ListaProdutosEntradaEstoqueToAddComponent,
  ],
  templateUrl: './entrada-estoque-form.component.html',
})
export class EntradaEstoqueFormComponent extends FormBase implements OnInit {
  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public readonly loadingAutocompleteProdutos$ = new BehaviorSubject<boolean>(false);

  public titleCard: string = '';
  public produtoToEdit: any = null;
  public readonly SITUACAO = SITUACAO;
  public produtosOptions: AutocompleteDto[] = [];
  public responseEntradaEstoque: Partial<EntradaEstoqueViewUpdateDto>;
  public produtosList: Array<Partial<ProdutoEntradaEstoqueCreateDto>> = [];

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly location: Location,
    private readonly messageService: MessageService,
    public override readonly activatedRoute: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
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
      produtos: this.fb.array([], [CustomValidators.produtosDuplicadosValidator()]),
    });
  }

  protected override afterIdentificarTipoRota(): void {
    this.setTitleCard();
    this.getAllProdutosAutocomplete();
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
    if (this.isView || this.isUpdate) {
      this.getData();
    }
  }

  getData() {
    this.loading$.next(true);
    this.entradaEstoqueQueryService
      .getById(this.id)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe((res) => {
        this.responseEntradaEstoque = res;
        this.form.patchValue(res);
        if (this.responseEntradaEstoque.entradasProdutos && this.responseEntradaEstoque.entradasProdutos.length > 0) {
          this.responseEntradaEstoque.entradasProdutos.forEach(p => {
            this.produtosList.push({
              idProduto: p.produto.id,
              precoUnitario: p.precoUnitario,
              quantidade: p.quantidade,
              desconto: p.desconto,
              status: p.status
            });
            console.log(this.produtosList);
          });
        }
      });
  }

  onSubmit(event, isRascunho: boolean = false) {
    event.preventDefault();
    if (this.form.valid && this.produtosList.length > 0) {
      this.addProdutosOnFormArray();
      this.setSituacaoOnForm(isRascunho);
      const dto = new EntradaEstoqueCreateDto(this.form.value);
      if (this.isCreate) {
        this.create(dto);
      } else if (this.isUpdate) {
        this.update(dto);
      }
    }
  }

  setSituacaoOnForm(isRascunho: boolean) {
    this.form.get('situacao').setValue(isRascunho ? SITUACAO.EM_CADASTRAMENTO : SITUACAO.CADASTRO_FINALIZADO);
  }

  create(dto: EntradaEstoqueCreateDto) {
    if (this.form.valid && this.produtosList.length > 0) {
      this.entradaEstoqueCommandService
        .create(dto)
        .subscribe((res) => {
          if (res) {
            this.messageSuccess();
          }
        });
    }
  }

  update(dto: EntradaEstoqueCreateDto) {
    if (this.form.valid && this.produtosList.length > 0) {
      this.entradaEstoqueCommandService
        .update(this.responseEntradaEstoque.idString, dto)
        .subscribe((res) => {
          if (res) {
            this.messageSuccess();
          }
        });
    }
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
    if (this.produtosList.length > 0 && !this.isView) {
      this.confirmarNavegacaoVoltar();
    } else {
      this.voltar();
    }
  }

  get produtosFormArray(): FormArray {
    return (this.form?.get('produtos') as FormArray) || this.fb.array([]);
  }

  getProdutoFormGroup(i: number): FormGroup {
    return this.produtosFormArray.at(i) as FormGroup;
  }

  createProdutoToFormArray(produto: Partial<ProdutoEntradaEstoqueCreateDto>): FormGroup {
    return this.fb.group({
      idProduto: [produto.idProduto, Validators.required],
      precoUnitario: [produto.precoUnitario, [Validators.required, Validators.min(0.01)]],
      quantidade: [produto.quantidade, [Validators.required, Validators.min(1)]],
      status: [STATUS.ATIVO, Validators.required],
      desconto: [produto.desconto],
    });
  }

  addProdutosOnFormArray(){
    this.produtosFormArray.clear();
    this.produtosList.forEach(p => {this.produtosFormArray.push(this.createProdutoToFormArray(p))});
  }

  addProdutoOnProdutosList(event) {
    if (this.validadeProdutoAlreadyAdded(event.idProduto)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Produto já adicionado na lista.\nVerifique os produtos adicionados.',
        life: 5000,
      });
      return;
    }
    if (event && this.validadeProdutoCanAdd(event)) {
      this.produtosList.push(event);
    }
  }

  onEditProdutoInList(event: any) {
    const produto = this.produtosList.find(p => p.idProduto === event);
    if (produto) {
      if (typeof produto.desconto === 'number') {
        const descontoPresenter = (produto.desconto * 100).toFixed(2);
        produto.desconto = `${descontoPresenter} %`;
      }
      this.produtoToEdit = {...produto};
      this.produtoToEdit.status = STATUS.ATIVO;
      this.onRemoveInProduto(event);
    }
  }

  onRemoveInProduto(event: any) {
    if (event) {
      this.produtosList = this.produtosList.filter(p => p.idProduto !== event);
    }
  }

  getAllProdutosAutocomplete() {
    this.loadingAutocompleteProdutos$.next(true);
    this.produtoQueryService
      .getAllAutocomplete()
      .pipe(finalize(() => this.loadingAutocompleteProdutos$.next(false)))
      .subscribe((produtos) => {
        this.produtosOptions = produtos;
      });
  }

  confirmarNavegacaoVoltar() {
    this.confirmationService.confirm({
      message:
        `Tem certeza que deseja sair? As alterações não salvas serão perdidas.`,
      header: 'Confirma?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.voltar()
    });
  }

  validadeProdutoCanAdd(produto: Partial<ProdutoEntradaEstoqueCreateDto>): boolean {
    for (const key of Object.keys(produto)) {
      if (key !== 'desconto' && key !== 'status') {
        if (produto[key] === null || produto[key] === undefined || produto[key] === '') {
          return false;
        }
      }
    }
    return true;
  }

  validadeProdutoAlreadyAdded(idProduto: string): boolean {
    return this.produtosList.some(p => p.idProduto === idProduto);
  }


  getSituacaoNormalized(situacao: SITUACAO) {
    return Utils.getSituacaoNormalized(situacao);
  }

  voltar() {
    if (window.history.length > 1) {
      // Existe histórico, pode voltar
      this.location.back();
    } else {
      // Não há histórico, redireciona manualmente
      this.router.navigate(['/entrada-estoque']);
    }
  }
}
