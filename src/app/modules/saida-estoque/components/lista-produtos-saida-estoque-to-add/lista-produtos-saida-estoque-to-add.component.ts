//Angular
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

//Externos
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

//Internos
import { SemDadosComponent } from '@shared/components/sem-dados/sem-dados.component';
import { ProdutoMovimentacaoAutocompleteDto } from '@produto/interfaces/produto-movimentacao-autocomplete-dto';
import { ProdutoMovimentacaoEstoqueCreateDto } from '@shared/interfaces/produto-movimentacao-estoque-create-dto';

@Component({
  selector: 'app-lista-produtos-saida-estoque-to-add',
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
  templateUrl: './lista-produtos-saida-estoque-to-add.component.html',
})
export class ListaProdutosSaidaEstoqueToAddComponent {
  @Input({ required: true }) isView: boolean = false;
  @Input({ required: true }) produtosOptions: Array<ProdutoMovimentacaoAutocompleteDto> = [];
  @Input({ required: true }) produtos: Array<
    Partial<ProdutoMovimentacaoEstoqueCreateDto>
  > = [];

  @Output() edit = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  getProdutoNameById(id: string): string {
    const produto = this.produtosOptions.find((p) => p.id === id);
    return produto ? produto.nome : '-';
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
