import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'pie-vendas',
  templateUrl: './pie-vendas.component.html',
  imports: [ChartModule, CardModule],
})
export class PieVendasComponent implements OnInit {
  pieData!: ChartData<'pie'>;
  pieOptions!: ChartOptions<'pie'>;

  ngOnInit() {
    // Simulate top 5 products and their sales
    const products = this.getTopProducts(); // e.g. ['Perfume A', ...]
    const sales = this.simulateSalesData(products.length);

    this.pieData = {
      labels: products,
      datasets: [
        {
          data: sales,
          // You can let Chart.js pick default colors, or define your own palette:
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
          ],
          hoverOffset: 10,
        },
      ],
    };

    this.pieOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const label = ctx.label || '';
              const value = ctx.parsed || 0;
              const total = ctx.dataset.data.reduce(
                (sum: number, v: any) => sum + v,
                0
              );
              const percent = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} vendas (${percent}%)`;
            },
          },
        },
      },
    };
  }

  /** Simula os nomes dos 5 principais produtos */
  private getTopProducts(): string[] {
    return [
      'Colônia Cítrica Frescor',
      'Elegance Paris',
      'Essência de Rosa',
      'Loção Hidratante',
      'Óleo Corporal',
    ];
  }

  /** Gera números de vendas aleatórios entre min e max */
  private simulateSalesData(count: number, min = 50, max = 300): number[] {
    return Array.from(
      { length: count },
      () => Math.floor(Math.random() * (max - min + 1)) + min
    );
  }
}
