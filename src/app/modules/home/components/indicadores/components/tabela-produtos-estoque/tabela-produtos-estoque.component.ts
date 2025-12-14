//Angular
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

//Externos
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject, finalize } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';

//Internos
import { SemDadosComponent } from '@shared/components/sem-dados/sem-dados.component';
import { ProdutosBaixaQuantidadeDTO } from '@home/interfaces/indicadores/produtos-baixa-quantidade-dto';
import { TabelaColuna, TabelaProdutosEstoqueConfig } from '@home/interfaces/indicadores/tabela-produtos-estoque-config';
import { ProdutosBaixaMovimentacaoEstoqueDTO } from '@home/interfaces/indicadores/produtos-baixa-movimentacao-estoque-dto';

@Component({
  selector: 'app-tabela-produtos-estoque',
  imports: [
    //Angular
    CommonModule,

    //Externos
    CardModule,
    TableModule,
    TooltipModule,
    SkeletonModule,

    //Internos
    SemDadosComponent
  ],
  templateUrl: './tabela-produtos-estoque.component.html',
  styleUrl: './tabela-produtos-estoque.component.scss'
})
export class TabelaProdutosEstoqueComponent implements OnInit {
  @Input({required: true}) config!: TabelaProdutosEstoqueConfig;

  $loadingData = new BehaviorSubject<boolean>(false);

  public dados: ProdutosBaixaMovimentacaoEstoqueDTO[] | ProdutosBaixaQuantidadeDTO[] = [];

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.$loadingData.next(true);
    this.config.getMethod()
    .pipe(finalize(() => this.$loadingData.next(false)))
    .subscribe({
      next: (response) => {
        this.dados = response;
      },
      error: (error) => {
        console.error('Erro ao carregar dados', error);
      }
    });
  }

  formatarValor(valor: any, coluna: TabelaColuna): string {
    if (coluna.formatter) {
      return coluna.formatter(valor);
    }
    return valor ?? '-';
  }

}
