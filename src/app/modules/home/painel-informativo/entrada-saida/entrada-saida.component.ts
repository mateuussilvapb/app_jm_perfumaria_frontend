import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Card } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'entrada-saida',
  templateUrl: 'entrada-saida.component.html',
  standalone: true,
  imports: [ChartModule, Card],
  // styleUrls: ['./chart-demo.component.scss']
})
export class EntradaSaidaComponent implements OnInit {
  lineData!: ChartData<'line'>;
  lineOptions!: ChartOptions<'line'>;

  ngOnInit() {
    const labels = this.getMonthLabels(); // 12 meses
    const entradas = this.simulateValueData(labels.length, 20000, 80000);
    const saidas = this.simulateValueData(labels.length, 15000, 100000);

    this.lineData = {
      labels,
      datasets: [
        {
          label: 'Entrada de Mercadorias (R$)',
          data: entradas,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Saída de Vendas (R$)',
          data: saidas,
          fill: true,
          tension: 0.4,
        },
      ],
    };

    this.lineOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (ctx) =>
              `${ctx.dataset.label}: R$ ${ctx.parsed.y?.toLocaleString(
                'pt-BR',
                { minimumFractionDigits: 2 }
              )}`,
          },
        },
      },
      scales: {
        x: {
          display: true,
          title: { display: true, text: 'Mês' },
        },
        y: {
          display: true,
          title: { display: true, text: 'Valor (R$)' },
          beginAtZero: true,
          ticks: {
            callback: (value) =>
              `R$ ${Number(value).toLocaleString('pt-BR', {
                minimumFractionDigits: 0,
              })}`,
          },
        },
      },
    };
  }

  /** Retorna os nomes dos 12 meses em PT */
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

  /**
   * Gera array de valores simulados em R$ entre min e max
   */
  private simulateValueData(count: number, min: number, max: number): number[] {
    const arr: number[] = [];
    for (let i = 0; i < count; i++) {
      const rnd = Math.random() * (max - min) + min;
      arr.push(Number(rnd.toFixed(2)));
    }
    return arr;
  }
}
