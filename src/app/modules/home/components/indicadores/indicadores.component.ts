//Angular
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

//Externos
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { BehaviorSubject, finalize } from 'rxjs';

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
    SkeletonModule,

    //Internos
    CardIndicadorComponent
  ],
  templateUrl: './indicadores.component.html',
})
export class IndicadoresComponent implements OnInit{
  
  public $loadingEstoqueInfo: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public informacoesEstoque: InformacoesEstoqueDTO;

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
