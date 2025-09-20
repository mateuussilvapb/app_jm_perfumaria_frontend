//Angular
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';

//Externos
import {
  TableModule,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject, finalize } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';

//Internos
import { Utils } from '@utils/utils';
import { STATUS } from '@shared/enums/status.enum';
import { UtilsService } from '@utils/utils.service';
import { Produto } from '@produto/interfaces/produto';
import { SITUACAO } from '@shared/enums/situacao.enum';
import { ROTAS_FORM } from '@shared/enums/rotas-form.enum';
import { SaidaEstoque } from '@saida-estoque/interfaces/saida-estoque';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { SemDadosComponent } from '@shared/components/sem-dados/sem-dados.component';
import { ProdutoSaidaEstoque } from 'app/modules/produto-saida-estoque/interfaces/produto-saida-estoque';
import { SaidaEstoqueCommandService } from '@saida-estoque/services/saida-estoque-command.service';
import { ProdutoSaidaEstoqueQueryService } from 'app/modules/produto-saida-estoque/services/produto-saida-estoque-query.service';
import { ContextMenuSaidaEstoque } from '@saida-estoque/components/context-menu-saida-estoque/context-menu-saida-estoque.component';

@Component({
  selector: 'app-saida-estoque-table',
  imports: [
    //Angular
    CommonModule,

    //Externos
    TagModule,
    CardModule,
    MenuModule,
    TableModule,
    ButtonModule,
    TooltipModule,

    //Interno
    LoadingComponent,
    SemDadosComponent,
  ],
  templateUrl: './saida-estoque-table.component.html',
})
export class SaidaEstoqueTableComponent implements AfterViewInit {
  @Input() refresh$: BehaviorSubject<void>;
  @Input() data: Array<Partial<SaidaEstoque>> = [];

  @ViewChild('actionMenu', { static: true }) actionMenu: any;

  public expandedRows = {};
  private contextMenu: ContextMenuSaidaEstoque;

  readonly STATUS = STATUS;
  readonly SITUACAO = SITUACAO;

  constructor(
    private readonly router: Router,
    private readonly utilsService: UtilsService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly saidaEstoqueCommandService: SaidaEstoqueCommandService,
    private readonly produtoSaidaEstoqueQueryService: ProdutoSaidaEstoqueQueryService
  ) {}

  ngAfterViewInit(): void {
    this.contextMenu = new ContextMenuSaidaEstoque(
      this.router,
      this.actionMenu,
      this.utilsService,
      this.refresh$,
      this.messageService,
      this.confirmationService,
      this.saidaEstoqueCommandService
    );

    this.onRefresh();
  }

  onToggleMenu(event: MouseEvent, saidaEstoque: SaidaEstoque) {
    this.contextMenu.toggle(event, { saidaEstoque });
  }

  getSituacaoNormalized(situacao: SITUACAO) {
    return Utils.getSituacaoNormalized(situacao);
  }

  onRowExpand(event: TableRowExpandEvent) {
    const saida = event.data;
    saida.loading = true;
    this.produtoSaidaEstoqueQueryService
      .findAllBySaidaEstoqueId(this.getParams(saida))
      .pipe(finalize(() => (saida.loading = false)))
      .subscribe({
        next: (res) => {
          saida.produtos = res;
        },
        error: () => {
          saida.produtos = [];
        },
      });
  }

  onRowCollapse(event: TableRowCollapseEvent) {}

  getParams(values) {
    let params = new URLSearchParams();
    if (values) {
      if (values.idString) {
        params.append('saidaEstoqueId', values.idString);
      }
      return params;
    }
    return null;
  }

  getValorUnitarioComDesconto(item: Partial<ProdutoSaidaEstoque>) {
    if (item?.desconto && item.desconto <= 0.0) return '-';
    const valorUnitarioComDesconto =
      item?.precoUnitario - item?.precoUnitario * item?.desconto;
    return valorUnitarioComDesconto;
  }

  getPrecoFinal(item: Partial<ProdutoSaidaEstoque>) {
    if (item?.desconto && item.desconto <= 0.0) return '-';
    const valorTotalSemDesconto = item?.precoUnitario * item?.quantidade;
    const valorFinal =
      valorTotalSemDesconto - valorTotalSemDesconto * item?.desconto;
    return valorFinal;
  }

  goToVisualizarProduto(item: Partial<ProdutoSaidaEstoque>) {
    this.router.navigate([
      `/produto/${item?.produto?.idString}/${ROTAS_FORM.VISUALIZAR}`,
    ]);
  }

  onRefresh() {
    this.refresh$.asObservable().subscribe(() => {
      if (this.expandedRows) {
        this.expandedRows = {};
      }
    });
  }

  getTooltipMessage(produto: Partial<Produto>): string {
    return `Categoria: ${produto?.categoria?.nome ?? ''}\nMarca: ${
      produto?.marca?.nome ?? ''
    }`;
  }
}
