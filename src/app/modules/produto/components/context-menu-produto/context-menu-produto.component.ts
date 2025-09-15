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
import { STATUS } from '@shared/enums/status.enum';
import { UtilsService } from '@utils/utils.service';
import { Produto } from '@produto/interfaces/produto';
import { ALL_ROLES, ROLES } from '@shared/models/roles';
import { ProdutoCommandService } from '@produto/service/produto-command.service';


export interface ContextMenuProdutoData {
  produto: Produto;
}

export class ContextMenuProduto extends ContextMenu<ContextMenuProdutoData> {
  constructor(
    router: Router,
    actionMenu: Menu,
    utilsService: UtilsService,
    private readonly refresh$: Subject<void>,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly produtoCommandService: ProdutoCommandService
  ) {
    super(router, actionMenu, utilsService);
  }

  protected override menuItems = (
    data: ContextMenuProdutoData
  ): MenuItensWithPermissions[] => [
    {
      id: 'visualizar',
      label: 'Visualizar',
      icon: 'pi pi-search',
      command: () => {
        this.onNavigate(`/produto/${data.produto.idString}/visualizar`);
      },
      rolesAllowed: [...ALL_ROLES],
    },
    {
      id: 'editar',
      label: 'Editar',
      icon: 'pi pi-user-edit',
      command: () => {
        this.onNavigate(`/produto/${data.produto.idString}/editar`);
      },
      rolesAllowed: [ROLES.ADMIN, ROLES.MANAGER],
    },
    ...(data.produto.status === STATUS.ATIVO
      ? [
          {
            id: 'desabilitar',
            label: 'Desabilitar',
            icon: 'pi pi-ban',
            rolesAllowed: [ROLES.ADMIN, ROLES.MANAGER],
            command: () => {
              this.onToggleSituacao(data.produto);
            },
          },
        ]
      : []),
    ...(data.produto.status === STATUS.INATIVO
      ? [
          {
            id: 'habilitar',
            label: 'Habilitar',
            icon: 'pi pi-check-circle',
            rolesAllowed: [ROLES.ADMIN, ROLES.MANAGER],
            command: () => {
              this.onToggleSituacao(data.produto);
            },
          },
        ]
      : []),
    {
      id: 'excluir',
      label: 'Excluir',
      icon: 'pi pi-trash',
      command: () => {
        this.onExcluir(data.produto.idString);
      },
      rolesAllowed: [ROLES.ADMIN],
    },
  ];

  private onExcluir(idString: string) {
    this.confirmationService.confirm({
      message:
        'Tem certeza que deseja excluir este produto?<br>A ação não poderá ser desfeita.',
      header: 'Confirma?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.excluir(idString),
    });
  }

  private excluir(idString: string) {
    this.produtoCommandService.delete(idString).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Produto excluído com sucesso.',
        life: 5000,
      });
      this.refresh$.next();
    });
  }

  private onToggleSituacao(produto: Produto) {
    const message = `Tem certeza que deseja ${
      produto.status === STATUS.ATIVO ? 'DESABILITAR' : 'HABILITAR'
    } o produto ${produto.nome}?`;
    this.confirmationService.confirm({
      message: message,
      header: 'Confirma?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.toggleSituacao(produto.idString),
    });
  }

  private toggleSituacao(idString: string) {
    this.produtoCommandService.toogleStatus(idString).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Status do produto alterada com sucesso!',
        life: 5000,
      });
      this.refresh$.next();
    });
  }

}

