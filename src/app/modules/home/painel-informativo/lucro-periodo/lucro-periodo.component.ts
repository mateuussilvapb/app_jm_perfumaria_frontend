import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'lucro-periodo',
  templateUrl: './lucro-periodo.component.html',
  styleUrls: ['./lucro-periodo.component.scss'],
  imports: [ChartModule, CardModule],
})
export class LucroPeriodoComponent implements OnInit {
  chartData!: ChartData<'bar' | 'line'>;
  chartOptions!: ChartOptions<'bar' | 'line'>;

  ngOnInit(): void {
    // labels (ex: últimos 12 meses)
    const labels = this.getMonthLabels();

    // Simular dados: receita e custo por mês (R$)
    const receita = this.simulateMonthValues(labels.length, 50000, 120000);
    const custo = this.simulateMonthValues(labels.length, 20000, 80000);

    // Calcular lucro e margem por mês
    const lucro = receita.map((r, i) => Number((r - custo[i]).toFixed(2)));
    const margem = receita.map((r, i) =>
      r > 0 ? Number(((lucro[i] / r) * 100).toFixed(2)) : 0
    );

    this.chartData = {
      labels,
      datasets: [
        {
          type: 'bar' as const,
          label: 'Receita (R$)',
          data: receita,
          backgroundColor: '#42A5F5',
          borderColor: '#1976D2',
          borderWidth: 1,
        },
        {
          type: 'bar' as const,
          label: 'Custo (R$)',
          data: custo,
          backgroundColor: '#FFCE56',
          borderColor: '#FFB300',
          borderWidth: 1,
        },
        {
          type: 'line' as const,
          label: 'Lucro (R$)',
          data: lucro,
          borderColor: '#66BB6A',
          backgroundColor: 'rgba(102,187,106,0.2)',
          tension: 0.3,
          yAxisID: 'y',
          pointRadius: 4,
          order: 2,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            // label para cada dataset
            label: (context) => {
              const label = context.dataset.label ?? '';
              const value = context.parsed.y ?? context.parsed;
              if (
                label.includes('Receita') ||
                label.includes('Custo') ||
                label.includes('Lucro')
              ) {
                return `${label}: ${this.formatCurrency(Number(value))}`;
              }
              return `${label}: ${value}`;
            },
            // rodapé do tooltip mostra margem quando for o ponto de lucro
            footer: (items) => {
              // items contém todos os dataset items do índice
              // encontrar índice do mês
              if (!items || items.length === 0) return '';
              const idx = items[0].dataIndex ?? items[0].dataIndex;
              const m = margem[idx] ?? 0;
              return `Margem: ${m}%`;
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: 'Mês' },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Valor (R$)' },
          ticks: {
            callback: (value) => this.formatCurrency(Number(value)),
          },
        },
      },
    };
  }

  /** utilitários */
  private getMonthLabels(): string[] {
    return [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
  }

  private simulateMonthValues(
    count: number,
    min: number,
    max: number
  ): number[] {
    return Array.from({ length: count }, () =>
      Number((Math.random() * (max - min) + min).toFixed(2))
    );
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  }
}
