//Angular
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

//Externos
import { CardModule } from 'primeng/card';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { SelectButtonModule } from 'primeng/selectbutton';

//Internos
import { ProdutoMovimentacaoAutocompleteDto } from '@produto/interfaces/produto-movimentacao-autocomplete-dto';
import { InputPrecoCustoComponent } from '@entrada-estoque/components/adicionar-produto-entrada-estoque/components/input-preco-custo/input-preco-custo.component';
import { InputPrecoClienteComponent } from '@entrada-estoque/components/adicionar-produto-entrada-estoque/components/input-preco-cliente/input-preco-cliente.component';
import { STATUS } from '@shared/enums/status.enum';

@Component({
  selector: 'app-adicionar-produto-entrada-estoque',
  imports: [
    //Angular
    FormsModule,
    CommonModule,
    CurrencyMaskModule,
    ReactiveFormsModule,

    //Externo
    CardModule,
    SelectButtonModule,

    //Interno
    InputPrecoCustoComponent,
    InputPrecoClienteComponent,
  ],
  templateUrl: './adicionar-produto-entrada-estoque.component.html'
})
export class AdicionarProdutoEntradaEstoqueComponent implements OnInit, OnChanges {
  @Input({ required: true }) produtoToEdit: any = null;
  @Input({ required: true }) produtosOptions: ProdutoMovimentacaoAutocompleteDto[] = [];

  @Output() adicionarProduto = new EventEmitter<any>();

  constructor(private readonly fb: FormBuilder) {
  }

  public form: FormGroup;
  public valueFormaInputDados: any = 'preco-cliente';
  public opcoesFormasInputDados: any[] = [{ label: 'Preço para cliente', value: 'preco-cliente' }, { label: 'Preço de custo', value: 'preco-custo' }];

  ngOnInit(): void {
    this.buildForm();
    this.onChangeFormaInputDados(this.valueFormaInputDados);
    if (this.produtoToEdit) {
      this.patchForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) {
      this.buildForm();
    }
    this.tratarProdutoToEdit(changes);
  }

  private tratarProdutoToEdit(changes?: SimpleChanges) {
    if (changes?.['produtoToEdit'] && this.produtoToEdit) {
      this.patchForm();
    }
  }

  patchForm() {
    this.form.patchValue(this.produtoToEdit);
  }

  buildForm() {
    if (this.form) return;
    this.form = this.fb.group({
      idProduto: [null, Validators.required],
      precoUnitario: [null, [Validators.required, Validators.min(0.01)]],
      
      descontoCliente: [null],
      porcentagemLucro: [null],
      precoCustoCliente: [null, [Validators.min(0.01)]],
      
      quantidade: [null, [Validators.required, Validators.min(1)]],
      desconto: [null],
      status: [STATUS.ATIVO, Validators.required],
    });
  }

  onAdicionarProduto(event: any) {
    if (this.form.valid) {
      if (this.valueFormaInputDados === 'preco-cliente') {
        this.form.get('desconto').setValue(null);
        this.form.get('desconto').updateValueAndValidity();
      }
      this.adicionarProduto.emit(event);
      this.produtoToEdit = null;
      this.form.reset();
    }
  }

  onChangeFormaInputDados(value: any) {
    const precoUnitarioControl = this.form.get('precoUnitario');
    if (value === 'preco-cliente' && this.form) {
      precoUnitarioControl?.disable();
    }
    if (value === 'preco-custo' && this.form) {
      precoUnitarioControl?.enable();
    }
  }
}
