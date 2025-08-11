import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'bar-vendas',
  templateUrl: './bar-vendas.component.html',
  imports: [ChartModule, CardModule],
})
export class BarVendasComponent implements OnInit {
  barData!: ChartData<'bar'>;
  barOptions!: ChartOptions<'bar'>;

  ngOnInit() {
    const products = this.getTopProducts();
    const sales = this.simulateSalesData(products.length);

    this.barData = {
      labels: products,
      datasets: [
        {
          label: 'Vendas',
          data: sales,
          // você pode customizar cores de cada barra:
          backgroundColor: [
            '#42A5F5',
            '#66BB6A',
            '#FFA726',
            '#AB47BC',
            '#EC407A',
          ],
          borderWidth: 1,
        },
      ],
    };

    this.barOptions = {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: 'Produto' },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Quantidade Vendida' },
          ticks: {
            stepSize: 50,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y} vendas`,
          },
        },
      },
    };
  }

  private getTopProducts(): string[] {
    return [
      'Colônia Cítrica Frescor',
      'Elegance Paris',
      'Essência de Rosa',
      'Loção Hidratante',
      'Óleo Corporal',
    ];
  }

  private simulateSalesData(count: number, min = 50, max = 300): number[] {
    return Array.from(
      { length: count },
      () => Math.floor(Math.random() * (max - min + 1)) + min
    ).sort((a, b) => b - a);
  }
}
