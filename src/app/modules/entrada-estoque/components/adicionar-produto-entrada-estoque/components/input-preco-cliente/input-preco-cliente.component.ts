//Angular
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

//Externos
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { SelectButtonModule } from 'primeng/selectbutton';

//Internos
import { STATUS } from '@shared/enums/status.enum';
import { OPTIONS_CURRENCY_MASK } from '@utils/constants';
import { ROTAS_FORM } from '@shared/enums/rotas-form.enum';
import { PorcentagemMaskDirective } from '@shared/directives/porcentagem-mask-directive';
import { GenericPopOverComponent } from '@shared/components/generic-pop-over/generic-pop-over.component';
import { ProdutoMovimentacaoAutocompleteDto } from '@produto/interfaces/produto-movimentacao-autocomplete-dto';
import { FormControlErrorsComponent } from '@shared/components/form-control-errors/form-control-errors.component';

@Component({
  selector: 'app-input-preco-cliente',
  imports: [
    //Angular
    FormsModule,
    CommonModule,
    CurrencyMaskModule,
    ReactiveFormsModule,

    //Externo
    CardModule,
    SelectModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    InputMaskModule,
    SelectButtonModule,

    //Interno
    GenericPopOverComponent,
    PorcentagemMaskDirective,
    FormControlErrorsComponent,
  ],
  templateUrl: './input-preco-cliente.component.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }), // começa acima
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })) // desce
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' })) // sobe e some
      ])
    ])
  ]
})
export class InputPrecoClienteComponent implements OnInit {
  @Input({required: true}) form: FormGroup;
  @Input({required: true}) produtoToEdit: any = null;
  @Input({required: true}) produtosOptions: ProdutoMovimentacaoAutocompleteDto[] = [];

  @Output() adicionarProduto = new EventEmitter<any>();

  @ViewChild(GenericPopOverComponent)
  genericPopOverComponent!: GenericPopOverComponent;

  public optionsCurrencyMask = OPTIONS_CURRENCY_MASK;

  constructor(
    protected readonly router: Router,
    protected readonly location: Location,
    public readonly activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.observarMudancasCampos();
    this.calcularPrecoUnitario();
  }

  onAdicionarProduto() {
    if (this.form.valid) {
      this.adicionarProduto.emit(this.form.getRawValue());
      this.form.reset();
      this.form.get('status')?.setValue(STATUS.ATIVO);
    }
  }

  onMouseEnterProduto(event: any) {
    this.genericPopOverComponent.showBtnAction = true;
    this.genericPopOverComponent.labelBtn = 'Adicionar Produto';
    this.genericPopOverComponent.acao = () => this.router.navigate([`/produto/${ROTAS_FORM.ADICIONAR}`]);
    this.genericPopOverComponent.mensagem = 'Caso queira adicionar um novo produto, clique no botão abaixo.'

    this.genericPopOverComponent.show(event);
  }

  onMouseLeavePopOver() {
    this.genericPopOverComponent.hide();
  }

  get produtoSelecionado(): ProdutoMovimentacaoAutocompleteDto | undefined {
    return this.produtosOptions.find(produto => produto.id === this.form.get('idProduto')?.value);
  }
  
  private observarMudancasCampos() {
    this.form.get('idProduto')?.valueChanges.subscribe(() => this.setarPrecoUnitario());

    this.form.get('descontoCliente')?.valueChanges.subscribe(() => this.calcularPrecoUnitario());
    this.form.get('porcentagemLucro')?.valueChanges.subscribe(() => this.calcularPrecoUnitario());
    this.form.get('precoCustoCliente')?.valueChanges.subscribe(() => this.calcularPrecoUnitario());
  }

  private setarPrecoUnitario() {
    if (!this.form.get('porcentagemLucro')?.value && !this.form.get('precoCustoCliente')?.value) {
      this.form.get('precoUnitario')?.setValue(this.produtoSelecionado?.precoCusto ?? null);
    }
  }

  private calcularPrecoUnitario() {
    const descontoCliente = this.form.get('descontoCliente')?.value;
    const porcentagemLucro = this.form.get('porcentagemLucro')?.value;
    const precoCustoCliente = this.form.get('precoCustoCliente')?.value;    

    const precoUnitarioControl = this.form.get('precoUnitario');
    let precoUnitario = 0;

    if (porcentagemLucro && precoCustoCliente) {
      if (descontoCliente) {
        const precoClienteComDesconto = precoCustoCliente * (1 - descontoCliente);
        const precoCustoVendedor = precoClienteComDesconto * (1 - porcentagemLucro);
        precoUnitario = precoCustoVendedor;
      } else {
        precoUnitario = precoCustoCliente * (1 - porcentagemLucro);
      }
    }  else if (precoUnitarioControl?.value > 0) {
      precoUnitario = precoUnitarioControl.value;
    }
    precoUnitarioControl.setValue(precoUnitario);
    precoUnitarioControl.updateValueAndValidity();
  }
}