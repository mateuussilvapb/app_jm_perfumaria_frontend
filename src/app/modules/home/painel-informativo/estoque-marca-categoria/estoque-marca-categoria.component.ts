import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'estoque-marca-categoria',
  templateUrl: './estoque-marca-categoria.component.html',
  styleUrls: ['./estoque-marca-categoria.component.scss'],
  imports: [CardModule, ChartModule]
})
export class EstoqueMarcaCategoriaComponent implements OnInit {

  barData!: ChartData<'bar'>;
  barOptions!: ChartOptions<'bar'>;

  ngOnInit(): void {
    const brands = this.getTop10Brands();
    const stocks = this.simulateStockLevels(brands.length, 500, 15000); // qtd em unidades

    this.barData = {
      labels: brands,
      datasets: [
        {
          label: 'Nível de Estoque (unidades)',
          data: stocks,
          backgroundColor: this.getPalette(brands.length),
          borderColor: this.getPalette(brands.length),
          borderWidth: 1
        }
      ]
    };

    this.barOptions = {
      responsive: true,
      indexAxis: 'x',
      scales: {
        x: {
          display: true,
          title: { display: true, text: 'Marca' },
          ticks: { autoSkip: false }
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Quantidade em Estoque' },
          ticks: {
            callback: (value) => `${Number(value).toLocaleString('pt-BR')}`
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const value = ctx.parsed.y ?? ctx.parsed;
              return `Estoque: ${Number(value).toLocaleString('pt-BR')} unidades`;
            },
            afterLabel: (ctx) => {
              // mostra percentual relativo ao total
              const total = (ctx.dataset.data as number[]).reduce((s, v) => s + Number(v), 0);
              const idx = ctx.dataIndex ?? 0;
              const val = Number((ctx.dataset.data as number[])[idx]);
              const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
              return `Participação: ${pct}%`;
            }
          }
        }
      }
    };
  }

  // 10 marcas exemplo
  private getTop10Brands(): string[] {
    return [
      'Elegance Paris',
      'Luxo & Aroma',
      'Rosa Dourada',
      'NaturaBelle',
      'AromaBrasil',
      'ScentWorks',
      'Perfumaria Real',
      'Essência Pura',
      'Beleza Viva',
      'Signature Studio'
    ];
  }

  // simula quantidade de estoque (inteiro)
  private simulateStockLevels(count: number, min = 500, max = 15000): number[] {
    return Array.from({ length: count }, () =>
      Math.floor(Math.random() * (max - min + 1)) + min
    ).sort((a, b) => b - a);
  }

  // gera paleta simples (repete se necessário)
  private getPalette(n: number): string[] {
    const palette = [
      '#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#EC407A',
      '#29B6F6', '#FF7043', '#9CCC65', '#26A69A', '#7E57C2'
    ];
    // se n > palette.length, repetir a paleta
    return Array.from({ length: n }, (_, i) => palette[i % palette.length]);
  }
}
