//Angular
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

//Externos
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject, finalize } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';

//Internos
import { LayoutService } from '@core/services/layout.service';
import { ScreenSizeService } from '@core/services/screen-size.service';
import { SemDadosComponent } from '@shared/components/sem-dados/sem-dados.component';
import { ProdutosBaixaQuantidadeDTO } from '@home/interfaces/produtos-baixa-quantidade-dto';
import { TabelaColuna, TabelaProdutosEstoqueConfig } from '@home/interfaces/tabela-produtos-estoque-config';
import { ProdutosBaixaMovimentacaoEstoqueDTO } from '@home/interfaces/produtos-baixa-movimentacao-estoque-dto';

@Component({
  selector: 'app-tabela-produtos-estoque',
  imports: [
    //Angular
    CommonModule,

    //Externos
    CardModule,
    TableModule,
    TooltipModule,
    SkeletonModule,

    //Internos
    SemDadosComponent
  ],
  templateUrl: './tabela-produtos-estoque.component.html'
})
export class TabelaProdutosEstoqueComponent implements OnInit {
  @Input({required: true}) config!: TabelaProdutosEstoqueConfig;

  $loadingData = new BehaviorSubject<boolean>(false);

  public dados: ProdutosBaixaMovimentacaoEstoqueDTO[] | ProdutosBaixaQuantidadeDTO[] = [];
  public scrollHeight: string = '400px';

  constructor(
    private readonly layoutService: LayoutService,
    private readonly screenSizeService: ScreenSizeService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.defineScrollHeight();
  }

  getData() {
    this.$loadingData.next(true);
    this.config.getMethod()
    .pipe(finalize(() => this.$loadingData.next(false)))
    .subscribe({
      next: (response) => {
        this.dados = response;
      },
      error: (error) => {
        console.error('Erro ao carregar dados', error);
      }
    });
  }

  formatarValor(valor: any, coluna: TabelaColuna): string {
    if (coluna.formatter) {
      return coluna.formatter(valor);
    }
    return valor ?? '-';
  }


  get getScrollHeight(): string {
    return this.scrollHeight;
  }

  set setScrollHeight(value: string) {
    this.scrollHeight = value;
  }

  private defineScrollHeight() {
    this.screenSizeService.width$.subscribe((width) => {
      if (width >= 1180) {
        this.scrollHeight = '400px';
      } else if (width >= 992 && this.layoutService.mainMenuVisible) {
        this.scrollHeight = '180px';
      } else if (width >= 840 && width < 992) {
        this.scrollHeight = '400px';
      } else if (width >= 768 && width < 840) {
        this.scrollHeight = '230px';
      } else if (width >= 356 && width < 768) {
        this.scrollHeight = '400px';
      } else {
        this.scrollHeight = '230px';
      }
    });
  }


}
