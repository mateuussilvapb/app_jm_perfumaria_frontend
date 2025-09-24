//Angular
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

//Externos
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

//Internos
import { AutocompleteDto } from '@shared/interfaces/autocomplete-dto';
import { SemDadosComponent } from '@shared/components/sem-dados/sem-dados.component';
import { ProdutoMovimentacaoEstoqueCreateDto } from '@shared/interfaces/produto-movimentacao-estoque-create-dto';

@Component({
  selector: 'app-lista-produtos-entrada-estoque-to-add',
  imports: [
    //Angular
    CommonModule,

    //Externos
    TableModule,
    ButtonModule,
    TooltipModule,

    //Internos
    SemDadosComponent,
  ],
  templateUrl: './lista-produtos-entrada-estoque-to-add.component.html',
})
export class ListaProdutosEntradaEstoqueToAddComponent {
  @Input({ required: true }) isView: boolean = false;
  @Input({ required: true }) produtosOptions: Array<AutocompleteDto> = [];
  @Input({ required: true }) produtos: Array<
    Partial<ProdutoMovimentacaoEstoqueCreateDto>
  > = [];

  @Output() edit = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  getProdutoNameById(id: string): string {
    const produto = this.produtosOptions.find((p) => p.value === id);
    return produto ? produto.label : '-';
  }

  getDescontoToPresenter(desconto: number | string) {
    if (desconto !== null && desconto !== undefined) {
      if (typeof desconto === 'number') {
        const descontoPresenter = (desconto * 100).toFixed(2);
        return descontoPresenter + ' %';
      }
      return desconto;
    }
    return '-';
  }
}
