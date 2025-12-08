//Angular
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

//Externos
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { BehaviorSubject, finalize } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';

//Internos
import { MESES_MAP } from '@utils/constants';
import { DashboardQueryService } from '@home/services/dashboard-query.service';
import { CardGenericoComponent } from '@home/components/card-generico/card-generico.component';
import { MovimentacoesEstoqueDTO } from '@home/interfaces/movimentacoes-estoque/movimentacoes-estoque-dto';

@Component({
  selector: 'app-resumo-mensal-saidas-estoque',
  imports: [
    //Angular
    CommonModule,

    //Externos
    CardModule,
    ChartModule,
    SkeletonModule,

    //Internos
    CardGenericoComponent
  ],
  templateUrl: './resumo-mensal-saidas-estoque.component.html'
})
export class ResumoMensalSaidasEstoqueComponent implements OnInit {
  public $loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  public dataChart: any;
  public optionsChart: any;

  public readonly heightSkeleton = '42rem';
  public readonly heightCards = '43rem';

  constructor(
    private cd: ChangeDetectorRef, 
    private readonly dashboardQueryService: DashboardQueryService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.$loading.next(true);
    this.dashboardQueryService.getResumoMensalSaidasEstoque()
      .pipe(
        finalize(() => this.$loading.next(false))
      ).subscribe({
        next: (data) => {
          this.initChart(data);
          console.log(data);
        },
        error: (error) => {
          console.error('Erro ao carregar movimentações de estoque.', error);
        }
      });
  }

  private initChart(data: MovimentacoesEstoqueDTO[]): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    this.dataChart = {
      labels: data.map(item => MESES_MAP[item.mes] + '/' + item.ano),
      datasets: [
        {
          label: 'Quantidade de Saídas de Estoque',
          backgroundColor: documentStyle.getPropertyValue('--p-orange-400'),
          borderColor: documentStyle.getPropertyValue('--p-orange-400'),
          data: data.map(item => item.quantidadeSaidas)
        },
        {
          label: 'Quantidade de Itens Vendidos',
          backgroundColor: documentStyle.getPropertyValue('--p-green-400'),
          borderColor: documentStyle.getPropertyValue('--p-green-400'),
          data: data.map(item => item.quantidadeTotal)
        }
      ]
    };

    this.optionsChart = {
      maintainAspectRatio: false,
      aspectRatio: 0.5,
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: textColorSecondary,
                  font: {
                      weight: 500
                  }
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          },
          y: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          }
      }
    };

    this.cd.markForCheck()
  }
}
