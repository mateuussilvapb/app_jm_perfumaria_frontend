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
import { EntradaEstoque } from '@entrada-estoque/interfaces/entrada-estoque';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { SemDadosComponent } from '@shared/components/sem-dados/sem-dados.component';
import { ProdutoEntradaEstoque } from '@produto-entrada-estoque/interfaces/produto-entrada-estoque';
import { EntradaEstoqueCommandService } from '@entrada-estoque/services/entrada-estoque-command.service';
import { ProdutoEntradaEstoqueQueryService } from '@produto-entrada-estoque/services/produto-entrada-estoque-query.service';
import { ContextMenuEntradaEstoque } from '@entrada-estoque/components/context-menu-entrada-estoque/context-menu-entrada-estoque.component';

@Component({
  selector: 'app-entrada-estoque-table',
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
  templateUrl: './entrada-estoque-table.component.html',
})
export class EntradaEstoqueTableComponent implements AfterViewInit {
  @Input() refresh$: BehaviorSubject<void>;
  @Input() data: Array<Partial<EntradaEstoque>> = [];

  @ViewChild('actionMenu', { static: true }) actionMenu: any;

  public expandedRows = {};
  private contextMenu: ContextMenuEntradaEstoque;

  readonly STATUS = STATUS;
  readonly SITUACAO = SITUACAO;

  constructor(
    private readonly router: Router,
    private readonly utilsService: UtilsService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly entradaEstoqueCommandService: EntradaEstoqueCommandService,
    private readonly produtoEntradaEstoqueQueryService: ProdutoEntradaEstoqueQueryService
  ) {}

  ngAfterViewInit(): void {
    this.contextMenu = new ContextMenuEntradaEstoque(
      this.router,
      this.actionMenu,
      this.utilsService,
      this.refresh$,
      this.messageService,
      this.confirmationService,
      this.entradaEstoqueCommandService
    );

    this.onRefresh();
  }

  onToggleMenu(event: MouseEvent, entradaEstoque: EntradaEstoque) {
    this.contextMenu.toggle(event, { entradaEstoque });
  }

  getSituacaoNormalized(situacao: SITUACAO) {
    return Utils.getSituacaoNormalized(situacao);
  }

  onRowExpand(event: TableRowExpandEvent) {
    const entrada = event.data;
    entrada.loading = true;
    this.produtoEntradaEstoqueQueryService
      .findAllByEntradaEstoqueId(this.getParams(entrada))
      .pipe(finalize(() => (entrada.loading = false)))
      .subscribe({
        next: (res) => {
          entrada.produtos = res;
        },
        error: () => {
          entrada.produtos = [];
        },
      });
  }

  onRowCollapse(event: TableRowCollapseEvent) {}

  getParams(values) {
    let params = new URLSearchParams();
    if (values) {
      if (values.idString) {
        params.append('entradaEstoqueId', values.idString);
      }
      return params;
    }
    return null;
  }

  getValorUnitarioComDesconto(item: Partial<ProdutoEntradaEstoque>) {
    if (item?.desconto && item.desconto <= 0.0) return '-';
    const valorUnitarioComDesconto =
      item?.precoUnitario - item?.precoUnitario * item?.desconto;
    return valorUnitarioComDesconto;
  }

  getPrecoFinal(item: Partial<ProdutoEntradaEstoque>) {
    if (item?.desconto && item.desconto <= 0.0) return '-';
    const valorTotalSemDesconto = item?.precoUnitario * item?.quantidade;
    const valorFinal =
      valorTotalSemDesconto - valorTotalSemDesconto * item?.desconto;
    return valorFinal;
  }

  goToVisualizarProduto(item: Partial<ProdutoEntradaEstoque>) {
    this.router.navigate([
      `/produto/${item?.produto?.idString}/${ROTAS_FORM.VISUALIZAR}`,
    ]);
  }

  onRefresh() {
    this.refresh$.asObservable().subscribe(() => {
      if (this.expandedRows) {
        this.expandedRows = {};
      }
    })
  }

  getTooltipMessage(produto: Partial<Produto>): string {
    return `Categoria: ${produto?.categoria?.nome ?? ''}\nMarca: ${produto?.marca?.nome ?? ''}`;
  }
}
