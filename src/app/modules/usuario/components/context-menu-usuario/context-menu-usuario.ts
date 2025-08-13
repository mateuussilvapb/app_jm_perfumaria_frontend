//Angular
import { Router } from '@angular/router';

//Externos
import { Menu } from 'primeng/menu';
import { BehaviorSubject, finalize, Subject } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

//Internos
import {
  ContextMenu,
  MenuItensWithPermissions,
} from '@shared/context-menu/context-menu';
import { ROLES } from '@shared/models/roles';
import { UtilsService } from '@utils/utils.service';
import { UsuarioResponseDto } from '@usuario/interfaces/usuario-response-dto';
import { UsuarioCommandService } from '@usuario/service/usuario-command.service';

export interface ContextMenuUsuarioData {
  usuario: UsuarioResponseDto;
}

export class ContextMenuUsuario extends ContextMenu<ContextMenuUsuarioData> {
  constructor(
    router: Router,
    actionMenu: Menu,
    utilsService: UtilsService,
    private readonly loading$: BehaviorSubject<boolean>,
    private readonly refresh$: Subject<void>,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly usuarioCommandService: UsuarioCommandService
  ) {
    super(router, actionMenu, utilsService);
  }

  protected override menuItems = (
    data: ContextMenuUsuarioData
  ): MenuItensWithPermissions[] => [
    {
      id: 'visualizar',
      label: 'Visualizar',
      icon: 'pi pi-search',
      command: () => {
        this.onNavigate(`/usuario/${data.usuario.id}/visualizar`);
      },
      rolesAllowed: [ROLES.ADMIN],
    },
    {
      id: 'editar',
      label: 'Editar',
      icon: 'pi pi-user-edit',
      command: () => {
        this.onNavigate(`/usuario/${data.usuario.id}/editar`);
      },
      rolesAllowed: [ROLES.ADMIN],
    },
    ...(data.usuario.enabled
      ? [
          {
            id: 'desabilitar',
            label: 'Desabilitar',
            icon: 'pi pi-ban',
            rolesAllowed: [ROLES.ADMIN],
            command: () => {
              this.onToggleStatus(data.usuario);
            },
          },
        ]
      : [
          {
            id: 'habilitar',
            label: 'Habilitar',
            icon: 'pi pi-check-circle',
            rolesAllowed: [ROLES.ADMIN],
            command: () => {
              this.onToggleStatus(data.usuario);
            },
          },
        ]),
    {
      id: 'excluir',
      label: 'Excluir',
      icon: 'pi pi-trash',
      command: () => {
        this.onExcluir(data.usuario.id);
      },
      rolesAllowed: [ROLES.ADMIN],
    },
  ];

  private onToggleStatus(usuario: UsuarioResponseDto) {
    const message = `Tem certeza que deseja ${
      usuario.enabled ? 'DESABILITAR' : 'HABILITAR'
    } o usuario ${usuario.firstName}?`;
    this.confirmationService.confirm({
      message: message,
      header: 'Confirma?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.toggleStatus(usuario.id),
    });
  }

  private toggleStatus(idString: string) {
    this.loading$.next(true);
    this.usuarioCommandService
      .toggleStatus(idString)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Status do Usuário alterado com sucesso!',
          life: 5000,
        });
        this.refresh$.next();
      });
  }

  private onExcluir(idString: string) {
    this.confirmationService.confirm({
      message:
        'Tem certeza que deseja excluir este usuário? A ação não poderá ser desfeita.',
      header: 'Confirma?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.excluir(idString),
    });
  }

  private excluir(idString: string) {
    this.loading$.next(true);
    this.usuarioCommandService
      .delete(idString)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário excluído com sucesso.',
          life: 5000,
        });
        this.refresh$.next();
      });
  }
}
