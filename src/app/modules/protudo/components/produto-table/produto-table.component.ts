//Angular
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';

//Externos
import { BehaviorSubject } from 'rxjs';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';

//Internos
import { Utils } from '@utils/utils';
import { STATUS } from '@shared/enums/status.enum';
import { UtilsService } from '@utils/utils.service';
import { Produto } from '../../interfaces/produto';
import { LayoutService } from '@core/services/layout.service';
import { SemDadosComponent } from '@shared/components/sem-dados/sem-dados.component';
import { ProdutoCommandService } from '../../service/produto-command.service';
import { ContextMenuProduto } from '../context-menu-produto/context-menu-produto.component';

@Component({
  selector: 'app-produto-table',
  imports: [
    //Angular
    CommonModule,

    //Externos
    TagModule,
    CardModule,
    MenuModule,
    TableModule,
    ButtonModule,

    //Internos
    SemDadosComponent,
  ],
  templateUrl: './produto-table.component.html',
})
export class ProdutoTableComponent implements AfterViewInit {
  @Input() data: Array<Produto> = [];
  @Input() refresh$: BehaviorSubject<void>;
  private contextMenu: ContextMenuProduto;
  @ViewChild('actionMenu', { static: true }) actionMenu: any;

  get isDarkTheme() {
    return this.layoutService.isDarkTheme();
  }

  readonly STATUS = STATUS;

  constructor(
    private readonly utilsService: UtilsService,
    private readonly layoutService: LayoutService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly produtoCommandService: ProdutoCommandService
  ) {}

  ngAfterViewInit(): void {
    this.contextMenu = new ContextMenuProduto(
      this.actionMenu,
      this.utilsService,
      this.refresh$,
      this.messageService,
      this.confirmationService,
      this.produtoCommandService
    );
  }

  onToggleMenu(event: MouseEvent, produto: Produto) {
    this.contextMenu.toggle(event, { produto: produto });
  }

  getStatusNormalized(status: STATUS) {
    return Utils.getStatusNormalized(status);
  }
}
