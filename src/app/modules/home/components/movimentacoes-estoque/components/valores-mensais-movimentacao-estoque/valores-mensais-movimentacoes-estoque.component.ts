//Angular
import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { ValoresEntradaSaidaEstoqueDTO } from '@home/interfaces/movimentacoes-estoque/valores-entrada-saida-estoque-dto';

@Component({
  selector: 'app-valores-mensais-movimentacoes-estoque',
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
  templateUrl: './valores-mensais-movimentacoes-estoque.component.html',
})
export class ValoresMensaisMovimentacoesEstoqueComponent implements OnInit {
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

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.$loading.next(true);
    this.dashboardQueryService
      .getValoresMensaisMovimentacaoEstoque()
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

  private getOptionsChart() {
    const currencyPipe = new CurrencyPipe('pt-BR', 'BRL');
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--p-text-muted-color'
    );
    const surfaceBorder = documentStyle.getPropertyValue(
      '--p-content-border-color'
    );

    return {
      indexAxis: 'x',
      maintainAspectRatio: false,
      aspectRatio: 0.5,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
        tooltip: {
          callbacks: {
            title: (tooltipItems) => {
              return tooltipItems[0].label;
            },
            label: (context) => {
              const label = context.dataset.label || '';
              const value = context.raw as number;
              return `${label}: ${currencyPipe.transform(value)}`;
            },
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
  }

  private processarDadosParaChart(data: ValoresEntradaSaidaEstoqueDTO): any {
    const documentStyle = getComputedStyle(document.documentElement);

    // Cria um mapa de meses únicos combinando entrada e saída
    const mesesMap = new Map<string, { ano: number; mes: number; entrada: number; entradaDesconto: number; saida: number; saidaDesconto: number }>();

    // Processa entradas
    data.entradaEstoqueValores.forEach((item) => {
      const key = `${item.ano}-${item.mes}`;
      if (!mesesMap.has(key)) {
        mesesMap.set(key, { ano: item.ano, mes: item.mes, entrada: 0, entradaDesconto: 0, saida: 0, saidaDesconto: 0 });
      }
      mesesMap.get(key)!.entrada = item.valorTotal;
      mesesMap.get(key)!.entradaDesconto = item.valorTotal - item.descontoTotal;
    });

    // Processa saídas
    data.saidaEstoqueValores.forEach((item) => {
      const key = `${item.ano}-${item.mes}`;
      if (!mesesMap.has(key)) {
        mesesMap.set(key, { ano: item.ano, mes: item.mes, entrada: 0, entradaDesconto: 0, saida: 0, saidaDesconto: 0 });
      }
      mesesMap.get(key)!.saida = item.valorTotal;
      mesesMap.get(key)!.saidaDesconto = item.valorTotal - item.descontoTotal;
    });

    // Ordena por ano e mês
    const mesesOrdenados = Array.from(mesesMap.values()).sort((a, b) => {
      if (a.ano !== b.ano) return a.ano - b.ano;
      return a.mes - b.mes;
    });

    // Cria labels e datasets
    const labels = mesesOrdenados.map((item) => MESES_MAP[item.mes] + '/' + item.ano);
    const entradasData = mesesOrdenados.map((item) => item.entrada);
    const saidasData = mesesOrdenados.map((item) => item.saida);
    const entradasDataDesconto = mesesOrdenados.map((item) => item.entradaDesconto);
    const saidasDataDesconto = mesesOrdenados.map((item) => item.saidaDesconto);

    return {
      labels,
      datasets: [
          {
          label: 'Valores de Entradas de Estoque (sem desconto)',
          backgroundColor: documentStyle.getPropertyValue('--p-orange-200'),
          borderColor: documentStyle.getPropertyValue('--p-orange-200'),
          data: entradasData,
        },
        {
          label: 'Valores de Entradas de Estoque (com desconto)',
          backgroundColor: documentStyle.getPropertyValue('--p-orange-400'),
          borderColor: documentStyle.getPropertyValue('--p-orange-400'),
          data: entradasDataDesconto,
        },
        {
          label: 'Valores de Saídas de Estoque (sem desconto)',
          backgroundColor: documentStyle.getPropertyValue('--p-green-200'),
          borderColor: documentStyle.getPropertyValue('--p-green-200'),
          data: saidasData,
        },
        {
          label: 'Valores de Saídas de Estoque (com desconto)',
          backgroundColor: documentStyle.getPropertyValue('--p-green-400'),
          borderColor: documentStyle.getPropertyValue('--p-green-400'),
          data: saidasDataDesconto,
        },
      ],
    };
  }

  private initChart(data: ValoresEntradaSaidaEstoqueDTO): void {
    this.dataChart = this.processarDadosParaChart(data);

    this.optionsChart = this.getOptionsChart()

    this.cd.markForCheck();
  }
}
