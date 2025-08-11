import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Modelo exemplo — adapte conforme seu serviço
interface SalesSnapshot {
  date: string; // ISO date
  revenue: number; // R$ total naquele período (ex: mês/dia)
  transactions: number; // número de vendas
}

@Component({
  selector: 'ticket-vendas',
  templateUrl: './ticket-vendas.component.html',
  styleUrls: ['./ticket-vendas.component.scss'],
  imports: [
    CardModule,
    ChartModule,
    ButtonModule,
    CommonModule,
    ProgressSpinnerModule,
  ],
})
export class TicketVendasComponent implements OnInit {
  // Valores calculados
  ticketMedio = 0; // R$
  volumeVendas = 0; // qtd
  totalRevenue = 0; // R$
  totalTransactions = 0; // qtd

  // Comparativo vs período anterior (ex: mês anterior)
  ticketMedioDelta = 0; // porcentagem (positivo = aumento)
  volumeDelta = 0; // porcentagem

  loading = true;

  // Sparkline data (últimos N períodos)
  sparkData!: ChartData<'line'>;
  sparkOptions!: ChartOptions<'line'>;

  // Simulação de chamadas ao backend — substitua pelo seu service
  private fakeServiceGetSnapshots(): Observable<SalesSnapshot[]> {
    const data: SalesSnapshot[] = [
      { date: '2024-08-01', revenue: 52000, transactions: 210 },
      { date: '2024-09-01', revenue: 47000, transactions: 195 },
      { date: '2024-10-01', revenue: 58000, transactions: 230 },
      { date: '2024-11-01', revenue: 61000, transactions: 250 },
      { date: '2024-12-01', revenue: 73000, transactions: 305 }, // período atual simulado
    ];
    // simula delay http
    return of(data).pipe(delay(400));
  }

  ngOnInit(): void {
    this.loadMetrics();
  }

  private loadMetrics(): void {
    this.loading = true;

    this.fakeServiceGetSnapshots()
      .pipe(map((snapshots) => this.calculateFromSnapshots(snapshots)))
      .subscribe({
        next: () => {
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          // tratar erro adequadamente
        },
      });
  }

  private calculateFromSnapshots(snapshots: SalesSnapshot[]): void {
    // assume snapshots ordenados do mais antigo ao mais recente
    const last = snapshots[snapshots.length - 1];
    const prev = snapshots[snapshots.length - 2] ?? {
      revenue: 0,
      transactions: 0,
    };

    // totais (pode ser soma do período desejado; aqui exemplo soma de todos)
    this.totalRevenue = snapshots.reduce((s, x) => s + x.revenue, 0);
    this.totalTransactions = snapshots.reduce((s, x) => s + x.transactions, 0);

    // Ticket médio = totalRevenue / totalTransactions
    this.ticketMedio =
      this.totalTransactions > 0
        ? Number((this.totalRevenue / this.totalTransactions).toFixed(2))
        : 0;

    // Alternativamente, calcular ticket do último período:
    const ticketLastPeriod =
      last.transactions > 0 ? last.revenue / last.transactions : 0;
    const ticketPrevPeriod =
      prev.transactions > 0 ? prev.revenue / prev.transactions : 0;
    this.ticketMedioDelta =
      ticketPrevPeriod > 0
        ? Number(
            (
              ((ticketLastPeriod - ticketPrevPeriod) / ticketPrevPeriod) *
              100
            ).toFixed(1)
          )
        : 0;

    // Volume (número de vendas) para o período atual e delta
    this.volumeVendas = last.transactions;
    this.volumeDelta =
      prev.transactions > 0
        ? Number(
            (
              ((last.transactions - prev.transactions) / prev.transactions) *
              100
            ).toFixed(1)
          )
        : 0;

    // Sparkline: plotar receita dos últimos N períodos (ex: meses)
    const labels = snapshots.map((s) => this.formatMonthLabel(s.date));
    const revenues = snapshots.map((s) => s.revenue);

    this.sparkData = {
      labels,
      datasets: [
        {
          label: 'Receita',
          data: revenues,
          fill: true,
          tension: 0.3,
          // não defina cores se quiser usar cores padrão; aqui você pode
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66,165,245,0.15)',
          pointRadius: 0,
        },
      ],
    };

    this.sparkOptions = {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        point: { radius: 0 },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `R$ ${Number(ctx.parsed.y).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}`,
          },
        },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
    };
  }

  // utilitário de exibição
  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  private formatMonthLabel(isoDate: string): string {
    const d = new Date(isoDate);
    return d.toLocaleString('pt-BR', { month: 'short', year: '2-digit' }); // ex: "dez/24"
  }

  // Função pública para forçar refresh (ex: botão)
  refresh(): void {
    this.loadMetrics();
  }
}
