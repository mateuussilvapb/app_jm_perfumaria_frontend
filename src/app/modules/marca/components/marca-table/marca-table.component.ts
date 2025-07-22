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
import { Marca } from '../../interfaces/marca';
import { SemDadosComponent } from '@shared/components/sem-dados/sem-dados.component';
import { MarcaCommandService } from '../../service/marca-command.service';
import { ContextMenuMarca } from '../../components/context-menu-marca/context-menu-marca.component';

@Component({
  selector: 'app-marca-table',
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
  templateUrl: './marca-table.component.html',
})
export class MarcaTableComponent implements AfterViewInit {
  @Input() data: Array<Marca> = [];
  @Input() refresh$: BehaviorSubject<void>;
  private contextMenu: ContextMenuMarca;
  @ViewChild('actionMenu', { static: true }) actionMenu: any;

  readonly STATUS = STATUS;

  constructor(
    private readonly utilsService: UtilsService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly marcaCommandService: MarcaCommandService
  ) {}

  ngAfterViewInit(): void {
    this.contextMenu = new ContextMenuMarca(
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
}
