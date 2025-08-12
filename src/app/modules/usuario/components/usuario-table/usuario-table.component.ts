//Angular
import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';

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
import { ROLES } from '@shared/models/roles';
import { UtilsService } from '@utils/utils.service';
import { LayoutService } from '@core/services/layout.service';
import { UsuarioResponseDto } from '@usuario/interfaces/usuario-response-dto';
import { UsuarioCommandService } from '@usuario/service/usuario-command.service';
import { SemDadosComponent } from '@shared/components/sem-dados/sem-dados.component';
import { ContextMenuUsuario } from '@usuario/components/context-menu-usuario/context-menu-usuario';

@Component({
  selector: 'app-usuario-table',
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
  templateUrl: './usuario-table.component.html',
})
export class UsuarioTableComponent {
  @Input() data: Array<UsuarioResponseDto> = [];
  @Input() refresh$: BehaviorSubject<void>;
  @Input() loading$: BehaviorSubject<boolean>;
  private contextMenu: ContextMenuUsuario;
  @ViewChild('actionMenu', { static: true }) actionMenu: any;

  constructor(
    private readonly utilsService: UtilsService,
    private readonly layoutService: LayoutService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly usuarioCommandService: UsuarioCommandService
  ) {}

  ngAfterViewInit(): void {
    this.contextMenu = new ContextMenuUsuario(
      this.actionMenu,
      this.utilsService,
      this.loading$,
      this.refresh$,
      this.messageService,
      this.confirmationService,
      this.usuarioCommandService
    );
  }

  getRolesNormalized(roles: Array<ROLES>) {
    roles.sort((a, b) => {
      return a.localeCompare(b);
    });
    return roles.map((r) => Utils.mapRolesPtBr[r]).join(', ');
  }

  onToggleMenu(event: MouseEvent, usuario: UsuarioResponseDto) {
    this.contextMenu.toggle(event, { usuario });
  }

  getStatusNormalized(status: boolean) {
    return Utils.getStatusUsuarioNormalized(status);
  }
}
