//Angular
import { Router } from '@angular/router';
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
    TagModule,
    CardModule,
    MenuModule,
    TableModule,
    ButtonModule,

    //Internos
    SemDadosComponent,
  ],
  templateUrl: './categoria-table.component.html',
})
export class CategoriaTableComponent implements AfterViewInit {
  @Input() data: Array<Categoria> = [];
  @Input() refresh$: BehaviorSubject<void>;
  private contextMenu: ContextMenuCategoria;
  @ViewChild('actionMenu', { static: true }) actionMenu: any;

  readonly STATUS = STATUS;

  constructor(
    private readonly router: Router,
    private readonly utilsService: UtilsService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly categoriaCommandService: CategoriaCommandService
  ) {}

  ngAfterViewInit(): void {
    this.contextMenu = new ContextMenuCategoria(
      this.router,
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

  getStatusNormalized(status: STATUS) {
    return Utils.getStatusNormalized(status);
  }
}
