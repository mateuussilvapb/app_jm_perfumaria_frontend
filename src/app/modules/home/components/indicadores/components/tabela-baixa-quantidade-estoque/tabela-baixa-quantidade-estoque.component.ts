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
import { ProdutosBaixaQuantidadeDTO } from '@home/interfaces/produtos-baixa-quantidade-dto';

@Component({
  selector: 'app-tabela-baixa-quantidade-estoque',
  imports: [
    //Angular
    CommonModule,

    //Externos
    CardModule,
    TableModule,
    TooltipModule,
    SkeletonModule,
  ],
  templateUrl: './tabela-baixa-quantidade-estoque.component.html'
})
export class TabelaBaixaQuantidadeEstoqueComponent implements OnInit {

  public $loadingBaixaQuantidadeInfo: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  public produtosBaixaQuantidade: ProdutosBaixaQuantidadeDTO[] = [];
  public tooltipMessage = 'Considera-se como baixa quantidade de produtos os que estão abaixo de 5 unidades em estoque';

  constructor(private readonly dashboardQueryService: DashboardQueryService) { }

  ngOnInit(): void {
    this.carregarProdutosBaixaQuantidade();
  }

  private carregarProdutosBaixaQuantidade(): void {
    this.$loadingBaixaQuantidadeInfo.next(true);
    this.dashboardQueryService.getProdutosBaixaQuantidadeEstoque()
      .pipe(finalize(() => this.$loadingBaixaQuantidadeInfo.next(false)))
      .subscribe({
        next: (response) => {
          this.produtosBaixaQuantidade = response;
        },
        error: (error) => {
          console.error('Erro ao carregar produtos com baixa quantidade', error);
        }
      });
  }
}
