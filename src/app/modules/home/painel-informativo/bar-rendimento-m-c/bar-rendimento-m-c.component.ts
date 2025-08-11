import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'bar-rendimento-m-c',
  templateUrl: './bar-rendimento-m-c.component.html',
  imports: [ChartModule, CardModule],
})
export class BarRendimentoMarcasCategoriasComponent implements OnInit {
  barData!: ChartData<'bar'>;
  barOptions!: ChartOptions<'bar'>;

  ngOnInit() {
    const marcas = this.getTopMarcas();
    const rendimento = this.simulateSalesData(marcas.length);

    this.barData = {
      labels: marcas,
      datasets: [
        {
          label: 'Vendas',
          data: rendimento,
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

  private getTopMarcas(): string[] {
    return [
      'Aroma Essencial',
      'Elegance Paris',
      'Nature Scents',
      'Urban Pulse',
      'Doce Infância',
      'Sensual Touch',
      'Sport Fresh',
      'Exclusive Aura',
      'Heritage Brew',
      'Therapy Scent',
      'Flora Radiante',
      'Caminho Suave',
      'Oceano Profundo',
      'Pimenta Rosa',
      'Vento da Manhã',
    ];
  }

  private simulateSalesData(count: number, min = 50, max = 300): number[] {
    return Array.from(
      { length: count },
      () => Math.floor(Math.random() * (max - min + 1)) + min
    ).sort((a, b) => b - a);
  }
}
