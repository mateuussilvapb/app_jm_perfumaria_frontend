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
import { Marca } from '@marca/interfaces/marca';
import { STATUS } from '@shared/enums/status.enum';
import { UtilsService } from '@utils/utils.service';
import { LayoutService } from '@core/services/layout.service';
import { MarcaCommandService } from '@marca/service/marca-command.service';
import { SemDadosComponent } from '@shared/components/sem-dados/sem-dados.component';
import { ContextMenuMarca } from '@marca/components/context-menu-marca/context-menu-marca.component';

@Component({
  selector: 'app-marca-table',
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
  templateUrl: './marca-table.component.html',
})
export class MarcaTableComponent implements AfterViewInit {
  @Input() data: Array<Marca> = [];
  @Input() refresh$: BehaviorSubject<void>;
  private contextMenu: ContextMenuMarca;
  @ViewChild('actionMenu', { static: true }) actionMenu: any;

  get isDarkTheme() {
    return this.layoutService.isDarkTheme();
  }

  readonly STATUS = STATUS;

  constructor(
    private readonly router: Router,
    private readonly utilsService: UtilsService,
    private readonly layoutService: LayoutService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly marcaCommandService: MarcaCommandService
  ) {}

  ngAfterViewInit(): void {
    this.contextMenu = new ContextMenuMarca(
      this.router,
      this.actionMenu,
      this.utilsService,
      this.refresh$,
      this.messageService,
      this.confirmationService,
      this.marcaCommandService
    );
  }

  onToggleMenu(event: MouseEvent, marca: Marca) {
    this.contextMenu.toggle(event, { marca });
  }

  getStatusNormalized(status: STATUS) {
    return Utils.getStatusNormalized(status);
  }
}
