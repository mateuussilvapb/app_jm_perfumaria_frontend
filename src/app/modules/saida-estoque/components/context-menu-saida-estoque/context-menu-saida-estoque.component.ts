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
import { UtilsService } from '@utils/utils.service';
import { SITUACAO } from '@shared/enums/situacao.enum';
import { ALL_ROLES, ROLES } from '@shared/models/roles';
import { MovimentacaoEstoque } from '@shared/interfaces/movimentacao-estoque';
import { SaidaEstoqueCommandService } from '@saida-estoque/services/saida-estoque-command.service';

export interface ContextMenuSaidaEstoqueData {
  saidaEstoque: Partial<MovimentacaoEstoque>;
}

export class ContextMenuSaidaEstoque extends ContextMenu<ContextMenuSaidaEstoqueData> {
  constructor(
    router: Router,
    actionMenu: Menu,
    utilsService: UtilsService,
    private readonly refresh$: Subject<void>,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly saidaEstoqueCommandService: SaidaEstoqueCommandService
  ) {
    super(router, actionMenu, utilsService);
  }

  protected override menuItems = (
    data: ContextMenuSaidaEstoqueData
  ): MenuItensWithPermissions[] => [
    {
      id: 'visualizar',
      label: 'Visualizar',
      icon: 'pi pi-search',
      command: () => {
        this.onNavigate(
          `/saida-estoque/${data.saidaEstoque.idString}/visualizar`
        );
      },
      rolesAllowed: [...ALL_ROLES],
    },
    {
      id: 'editar',
      label: 'Editar',
      icon: 'pi pi-user-edit',
      command: () => {
        this.onNavigate(
          `/saida-estoque/${data.saidaEstoque.idString}/editar`
        );
      },
      rolesAllowed: [ROLES.ADMIN, ROLES.MANAGER],
    },
    {
      id: 'excluir',
      label: 'Excluir',
      icon: 'pi pi-trash',
      command: () => {
        this.onExcluir(data.saidaEstoque);
      },
      rolesAllowed: [ROLES.ADMIN],
    },
  ];

  private onExcluir(saidaEstoque: Partial<MovimentacaoEstoque>) {
    let mensagem = `Tem certeza que deseja excluir esta saida de estoque? A ação não poderá ser desfeita.`;
    if (saidaEstoque.situacao === SITUACAO.CADASTRO_FINALIZADO) {
      mensagem += `<br>Além disso, haverá repercursão no estoque: os itens adicionados serão removidos.<br>Confirma?`;
    }
    this.confirmationService.confirm({
      message: mensagem,
      header: 'Confirma?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.excluir(saidaEstoque.idString),
    });
  }

  private excluir(idString: string) {
    this.saidaEstoqueCommandService.delete(idString).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Saida de Estoque excluída com sucesso.',
        life: 5000,
      });
      this.refresh$.next();
    });
  }
}
