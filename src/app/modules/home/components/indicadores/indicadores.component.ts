//Angular
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

//Externos
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject, finalize } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';

//Internos
import { DashboardQueryService } from '@home/services/dashboard-query.service';
import { InformacoesEstoqueDTO } from '@home/interfaces/informacoes-estoque-dto';
import { CardIndicadorComponent } from '@home/components/card-indicador/card-indicador.component';


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
    CardIndicadorComponent
  ],
  templateUrl: './indicadores.component.html',
})
export class IndicadoresComponent implements OnInit{
  
  public $loadingEstoqueInfo: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public informacoesEstoque: InformacoesEstoqueDTO;

  public readonly heightSkeleton = '8rem';
  public readonly tooltipMessage = 'Os valores monetários (custo, venda e lucro) são estimativas baseadas nos preços atuais dos produtos. Caso tenham ocorrido alterações nos valores de custo ou venda ao longo do tempo, os resultados podem apresentar divergências — indicando quantidades maiores ou menores do que as reais';

  constructor(private readonly dashboardQueryService: DashboardQueryService) {}

  ngOnInit(): void {
    this.carregarInformacoesEstoque();
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
    return pipeCurrency.transform(valor, 'BRL', true, '1.2-2');
  }
}
