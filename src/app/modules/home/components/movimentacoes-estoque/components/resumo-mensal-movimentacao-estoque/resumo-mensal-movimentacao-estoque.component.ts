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
import { MovimentacoesEntradaSaidaEstoqueDTO } from '@home/interfaces/movimentacoes-estoque/movimentacoes-entrada-saida-estoque-dto';
import { SelectItem } from 'primeng/api';
import { MovimentacoesEstoqueDTO } from '@home/interfaces/movimentacoes-estoque/movimentacoes-estoque-dto';

@Component({
  selector: 'app-resumo-mensal-movimentacao-estoque',
  imports: [
    //Angular
    CommonModule,

    //Externos
    CardModule,
    ChartModule,
    SkeletonModule,

    //Internos
    CardGenericoComponent,
  ],
  templateUrl: './resumo-mensal-movimentacao-estoque.component.html',
})
export class ResumoMensalMovimentacaoEstoqueComponent implements OnInit {
  public $loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public dataChart: any;
  public optionsChart: any;

  public readonly heightSkeleton = '42rem';
  public readonly heightCards = '43rem';

  constructor(
    private cd: ChangeDetectorRef,
    private readonly dashboardQueryService: DashboardQueryService
  ) {}

  // Opções e valor selecionado do SelectButton (agora recebidos via @Input)
  public stateOptions: SelectItem[] = [
    { label: 'Entradas', value: 'entradas' },
    { label: 'Saidas', value: 'saidas' },
  ];

  private _selectedView: string = 'entradas';

  public get selectedView(): string {
    return this._selectedView;
  }

  public set selectedView(val: string) {
    this._selectedView = val;
    this.updateChartBySelectedView();
  }
  public dataChartView: { [key: string]: any } = {};

  ngOnInit(): void {
    this.loadData();
  }

  private updateChartBySelectedView(): void {
    if (!this.dataChartView || Object.keys(this.dataChartView).length === 0) {
      return;
    }

    this.dataChart = this.dataChartView[this.selectedView];
    this.cd.markForCheck();
  }

  private loadData(): void {
    this.$loading.next(true);
    this.dashboardQueryService
      .getResumoMensalMovimentacaoEstoque()
      .pipe(finalize(() => this.$loading.next(false)))
      .subscribe({
        next: (data) => {
          this.initChart(data);
        },
        error: (error) => {
          console.error('Erro ao carregar movimentações de estoque.', error);
        },
      });
  }

  private processarDadosParaChart(
    data: MovimentacoesEstoqueDTO[],
    isEntrada: boolean
  ): any {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
      labels: data.map((item) => MESES_MAP[item.mes] + '/' + item.ano),
      datasets: [
        {
          label: `Quantidade de ${
            isEntrada ? 'Entradas' : 'Saídas'
          } de Estoque`,
          backgroundColor: documentStyle.getPropertyValue('--p-orange-400'),
          borderColor: documentStyle.getPropertyValue('--p-orange-400'),
          data: data.map((item) => item.quantidadeSaidas),
        },
        {
          label: 'Quantidade de Itens Vendidos',
          backgroundColor: documentStyle.getPropertyValue('--p-green-400'),
          borderColor: documentStyle.getPropertyValue('--p-green-400'),
          data: data.map((item) => item.quantidadeTotal),
        },
      ],
    };
  }

  private initChart(data: MovimentacoesEntradaSaidaEstoqueDTO): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--p-text-muted-color'
    );
    const surfaceBorder = documentStyle.getPropertyValue(
      '--p-content-border-color'
    );

    this.dataChartView = {
      entradas: this.processarDadosParaChart(data.entradaEstoqueItens, true),
      saidas: this.processarDadosParaChart(data.saidaEstoqueItens, false),
    };

    this.dataChart = this.dataChartView[this.selectedView];

    this.optionsChart = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.5,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    this.cd.markForCheck();
  }
}
