//Externos
import { Subject } from 'rxjs';
import { Menu } from 'primeng/menu';
import { ConfirmationService, MessageService } from 'primeng/api';

//Internos
import {
  ContextMenu,
  MenuItensWithPermissions,
} from '@shared/context-menu/context-menu';
import { STATUS } from '@shared/enums/status.enum';
import { UtilsService } from '@utils/utils.service';
import { ALL_ROLES, ROLES } from '@shared/models/roles';
import { Categoria } from '@categoria/interfaces/categoria';
import { CategoriaCommandService } from '@categoria/service/categoria-command.service';

export interface ContextMenuCategoriaData {
  categoria: Categoria;
}

export class ContextMenuCategoria extends ContextMenu<ContextMenuCategoriaData> {
  constructor(
    actionMenu: Menu,
    utilsService: UtilsService,
    private readonly refresh$: Subject<void>,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly categoriaCommandService: CategoriaCommandService
  ) {
    super(actionMenu, utilsService);
  }

  protected override menuItems = (
    data: ContextMenuCategoriaData
  ): MenuItensWithPermissions[] => [
    {
      id: 'visualizar',
      label: 'Visualizar',
      icon: 'pi pi-search',
      url: `${this.baseHref}/categoria/${data.categoria.idString}/visualizar`,
      rolesAllowed: [...ALL_ROLES],
    },
    {
      id: 'editar',
      label: 'Editar',
      icon: 'pi pi-user-edit',
      url: `${this.baseHref}/categoria/${data.categoria.idString}/editar`,
      rolesAllowed: [ROLES.ADMIN, ROLES.MANAGER],
    },
    ...(data.categoria.status === STATUS.ATIVO
      ? [
          {
            id: 'desabilitar',
            label: 'Desabilitar',
            icon: 'pi pi-ban',
            rolesAllowed: [ROLES.ADMIN, ROLES.MANAGER],
            command: () => {
              this.onToggleSituacao(data.categoria);
            },
          },
        ]
      : []),
    ...(data.categoria.status === STATUS.INATIVO
      ? [
          {
            id: 'habilitar',
            label: 'Habilitar',
            icon: 'pi pi-check-circle',
            rolesAllowed: [ROLES.ADMIN, ROLES.MANAGER],
            command: () => {
              this.onToggleSituacao(data.categoria);
            },
          },
        ]
      : []),
    {
      id: 'excluir',
      label: 'Excluir',
      icon: 'pi pi-trash',
      command: () => {
        this.onExcluir(data.categoria.idString);
      },
      rolesAllowed: [ROLES.ADMIN],
    },
  ];

  private onExcluir(idString: string) {
    this.confirmationService.confirm({
      message:
        'Tem certeza que deseja excluir esta categoria? A ação não poderá ser desfeita.',
      header: 'Confirma?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.excluir(idString),
    });
  }

  private excluir(idString: string) {
    this.categoriaCommandService.delete(idString).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Categoria excluída com sucesso.',
        life: 5000,
      });
      this.refresh$.next();
    });
  }

  private onToggleSituacao(categoria: Categoria) {
    const message = `Tem certeza que deseja ${
      categoria.status === STATUS.ATIVO ? 'DESABILITAR' : 'HABILITAR'
    } a categoria ${categoria.nome}?`;
    this.confirmationService.confirm({
      message: message,
      header: 'Confirma?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.toggleSituacao(categoria.idString),
    });
  }

  private toggleSituacao(idString: string) {
    this.categoriaCommandService.toggleStatus(idString).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Status da Categoria alterado com sucesso!',
        life: 5000,
      });
      this.refresh$.next();
    });
  }
}
