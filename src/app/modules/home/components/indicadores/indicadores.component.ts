//Angular
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

//Externos
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject, finalize } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';

//Internos
import { DashboardQueryService } from '@home/services/dashboard-query.service';
import { InformacoesEstoqueDTO } from '@home/interfaces/indicadores/informacoes-estoque-dto';
import { TabelaProdutosEstoqueConfig } from '@home/interfaces/indicadores/tabela-produtos-estoque-config';
import { CardIndicadorComponent } from '@home/components/indicadores/components/card-indicador/card-indicador.component';
import { TabelaProdutosEstoqueComponent } from '@home/components/indicadores/components/tabela-produtos-estoque/tabela-produtos-estoque.component';


@Component({
  selector: 'app-indicadores',
  imports: [
    //Angular
    CommonModule,

    //Externos
    DividerModule,
    TooltipModule,
    SkeletonModule,

    //Internos
    CardIndicadorComponent,
    TabelaProdutosEstoqueComponent
  ],
  templateUrl: './indicadores.component.html',
})
export class IndicadoresComponent implements OnInit{
  
  public $loadingEstoqueInfo: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public informacoesEstoque: InformacoesEstoqueDTO;

  public configTabelaProdutosBaixaMovimentacao: TabelaProdutosEstoqueConfig;
  public configTabelaProdutosBaixaQuantidade: TabelaProdutosEstoqueConfig;

  public readonly heightSkeleton = '8rem';
  public readonly heightCards = '9rem';
  public readonly tooltipMessage = 'Os valores monetários (custo, venda e lucro) são estimativas baseadas nos preços atuais dos produtos. Caso tenham ocorrido alterações nos valores de custo ou venda ao longo do tempo, os resultados podem apresentar divergências — indicando quantidades maiores ou menores do que as reais';

  constructor(private readonly dashboardQueryService: DashboardQueryService) {}

  ngOnInit(): void {
    this.setConfigsTabelasProdutosEstoque();
    this.carregarInformacoesEstoque();
  }

  private setConfigsTabelasProdutosEstoque(): void {
    this.setConfigTabelaProdutosBaixaMovimentacao();
    this.setConfigTabelaProdutosBaixaQuantidade();
  }

  private setConfigTabelaProdutosBaixaMovimentacao(): void {
    this.configTabelaProdutosBaixaMovimentacao = {
      titulo: 'Produtos com baixa movimentação',
      icone: 'pi-times',
      tooltipMessage: 'Considera-se como baixa movimentação no estoque os produtos que não foram vendidos a mais de 60 dias',
      borderColor: 'border-red-500',
      iconColor: 'text-red-500',
      colunas: [
          { header: 'Nome', field: 'nome', width: '50%' },
          { header: 'Dias sem movimentação', field: 'diasSemMovimentacao', width: '50%', formatter: (value) => value ? value : 'Nunca houve movimentação' }
        ],
      getMethod: () => this.dashboardQueryService.getProdutosBaixaMovimentacaoEstoque()
    }
    
  }

  private setConfigTabelaProdutosBaixaQuantidade(): void {
    this.configTabelaProdutosBaixaQuantidade = {
      titulo: 'Produtos com baixa quantidade',
      icone: 'pi-table',
      tooltipMessage: 'Considera-se como baixa quantidade de produtos os que estão abaixo de 5 unidades em estoque',
      borderColor: 'border-red-500',
      iconColor: 'text-red-500',
      colunas: [
          { header: 'Nome', field: 'nome', width: '70%' },
          { header: 'Quantidade', field: 'quantidadeEmEstoque', width: '30%' }
        ],
      getMethod: () => this.dashboardQueryService.getProdutosBaixaQuantidadeEstoque()
    }
  }

  private carregarInformacoesEstoque(): void {
    this.$loadingEstoqueInfo.next(true);
    this.dashboardQueryService.getInformacoesEstoque()
      .pipe(finalize(() => this.$loadingEstoqueInfo.next(false)))
      .subscribe({
        next: (response) => {
          this.informacoesEstoque = response;
        },
        error: (error) => {
          console.error('Erro ao carregar informações de estoque', error);
        }
      });
  }

  valorMonetarioFormatado(valor: number): string {
    const pipeCurrency = new CurrencyPipe('pt-BR');
    return pipeCurrency.transform(valor, 'BRL', 'symbol', '1.2-2');
  }
}
