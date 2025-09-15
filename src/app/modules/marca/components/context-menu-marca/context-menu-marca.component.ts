//Angular
import { Router } from '@angular/router';

//Externos
import { Subject } from 'rxjs';
import { Menu } from 'primeng/menu';
import { ConfirmationService, MessageService } from 'primeng/api';

//Internos
import {
  ContextMenu,
  MenuItensWithPermissions,
} from '@shared/context-menu/context-menu';
import { Marca } from '@marca/interfaces/marca';
import { STATUS } from '@shared/enums/status.enum';
import { UtilsService } from '@utils/utils.service';
import { ALL_ROLES, ROLES } from '@shared/models/roles';
import { MarcaCommandService } from '@marca/service/marca-command.service';

export interface ContextMenuMarcaData {
  marca: Marca;
}

export class ContextMenuMarca extends ContextMenu<ContextMenuMarcaData> {
  constructor(
    router: Router,
    actionMenu: Menu,
    utilsService: UtilsService,
    private readonly refresh$: Subject<void>,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly marcaCommandService: MarcaCommandService
  ) {
    super(router, actionMenu, utilsService);
  }

  protected override menuItems = (
    data: ContextMenuMarcaData
  ): MenuItensWithPermissions[] => [
    {
      id: 'visualizar',
      label: 'Visualizar',
      icon: 'pi pi-search',
      command: () => {
        this.onNavigate(`/marca/${data.marca.idString}/visualizar`);
      },
      rolesAllowed: [...ALL_ROLES],
    },
    {
      id: 'editar',
      label: 'Editar',
      icon: 'pi pi-user-edit',
      command: () => {
        this.onNavigate(`/marca/${data.marca.idString}/editar`);
      },
      rolesAllowed: [ROLES.ADMIN, ROLES.MANAGER],
    },
    ...(data.marca.status === STATUS.ATIVO
      ? [
          {
            id: 'desabilitar',
            label: 'Desabilitar',
            icon: 'pi pi-ban',
            rolesAllowed: [ROLES.ADMIN, ROLES.MANAGER],
            command: () => {
              this.onToggleSituacao(data.marca);
            },
          },
        ]
      : []),
    ...(data.marca.status === STATUS.INATIVO
      ? [
          {
            id: 'habilitar',
            label: 'Habilitar',
            icon: 'pi pi-check-circle',
            rolesAllowed: [ROLES.ADMIN, ROLES.MANAGER],
            command: () => {
              this.onToggleSituacao(data.marca);
            },
          },
        ]
      : []),
    {
      id: 'excluir',
      label: 'Excluir',
      icon: 'pi pi-trash',
      command: () => {
        this.onExcluir(data.marca.idString);
      },
      rolesAllowed: [ROLES.ADMIN],
    },
  ];

  private onExcluir(idString: string) {
    this.confirmationService.confirm({
      message:
        'Tem certeza que deseja excluir esta marca?<br>A ação não poderá ser desfeita.',
      header: 'Confirma?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.excluir(idString),
    });
  }

  private excluir(idString: string) {
    this.marcaCommandService.delete(idString).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Marca excluída com sucesso.',
        life: 5000,
      });
      this.refresh$.next();
    });
  }

  private onToggleSituacao(marca: Marca) {
    const message = `Tem certeza que deseja ${
      marca.status === STATUS.ATIVO ? 'DESABILITAR' : 'HABILITAR'
    } a marca ${marca.nome}?`;
    this.confirmationService.confirm({
      message: message,
      header: 'Confirma?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.toggleSituacao(marca.idString),
    });
  }

  private toggleSituacao(idString: string) {
    this.marcaCommandService.toggleStatus(idString).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Status da Marca alterada com sucesso!',
        life: 5000,
      });
      this.refresh$.next();
    });
  }
}
