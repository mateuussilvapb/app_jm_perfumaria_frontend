import { LayoutService } from './../../../../core/services/layout.service';
//Angular
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';

//Externos
import { BehaviorSubject } from 'rxjs';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';

//Internos
import { STATUS } from '@shared/enums/status.enum';
import { UtilsService } from '@utils/utils.service';
import { StatusPipe } from '@shared/pipes/status.pipe';
import { Categoria } from '@categoria/interfaces/categoria';
import { SemDadosComponent } from '@shared/components/sem-dados/sem-dados.component';
import { CategoriaCommandService } from '@categoria/service/categoria-command.service';
import { ContextMenuCategoria } from '@categoria/components/context-menu-categoria/context-menu-categoria.component';

@Component({
  selector: 'app-categoria-table',
  imports: [
    //Angular
    CommonModule,

    //Externos
    CardModule,
    MenuModule,
    TableModule,
    ButtonModule,

    //Internos
    StatusPipe,
    SemDadosComponent,
  ],
  templateUrl: './categoria-table.component.html',
})
export class CategoriaTableComponent implements AfterViewInit {
  @Input() data: Array<Categoria> = [];
  @Input() refresh$: BehaviorSubject<void>;
  private contextMenu: ContextMenuCategoria;
  @ViewChild('actionMenu', { static: true }) actionMenu: any;

  get isDarkTheme() {
    return this.layoutService.isDarkTheme();
  }

  readonly STATUS = STATUS;

  constructor(
    private readonly utilsService: UtilsService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly categoriaCommandService: CategoriaCommandService,
    private readonly layoutService: LayoutService
  ) {}

  ngAfterViewInit(): void {
    this.contextMenu = new ContextMenuCategoria(
      this.actionMenu,
      this.utilsService,
      this.refresh$,
      this.messageService,
      this.confirmationService,
      this.categoriaCommandService
    );
  }

  onToggleMenu(event: MouseEvent, categoria: Categoria) {
    this.contextMenu.toggle(event, { categoria });
  }
}
