//Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

//Externos
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject, finalize } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';

//Internos
import { DashboardQueryService } from '@home/services/dashboard-query.service';
import { ProdutosBaixaMovimentacaoEstoqueDTO } from '@home/interfaces/produtos-baixa-movimentacao-estoque-dto';

@Component({
  selector: 'app-tabela-baixa-movimentacao-estoque',
  imports: [
    //Angular
    CommonModule,

    //Externos
    CardModule,
    TableModule,
    TooltipModule,
    SkeletonModule,
  ],
  templateUrl: './tabela-baixa-movimentacao-estoque.component.html'
})
export class TabelaBaixaMovimentacaoEstoqueComponent implements OnInit {

  public $loadingBaixaMovimentacaoInfo: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  public produtosBaixaMovimentacao: ProdutosBaixaMovimentacaoEstoqueDTO[] = [];
  public tooltipMessage = 'Considera-se como baixa movimentação no estoque os produtos que não foram vendidos a mais de 60 dias';

  constructor(private readonly dashboardQueryService: DashboardQueryService) { }

  ngOnInit(): void {
    this.carregarProdutosBaixaMovimentacao();
  }

  private carregarProdutosBaixaMovimentacao(): void {
    this.$loadingBaixaMovimentacaoInfo.next(true);
    this.dashboardQueryService.getProdutosBaixaMovimentacaoEstoque()
      .pipe(finalize(() => this.$loadingBaixaMovimentacaoInfo.next(false)))
      .subscribe({
        next: (response) => {
          this.produtosBaixaMovimentacao = response;
        },
        error: (error) => {
          console.error('Erro ao carregar produtos com baixa movimentação', error);
        }
      });
  }
}
