//Externos
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

//Internos
import { Utils } from '@utils/utils';
import { ROLES } from '@shared/models/roles';
import { UtilsService } from '@utils/utils.service';
import { environment } from 'environments/environment';

export interface MenuItensWithPermissions extends MenuItem {
  id: string;
  rolesAllowed?: ROLES[];
}

export abstract class ContextMenu<T> {
  protected readonly baseHref: string;

  constructor(
    protected readonly actionMenu: Menu,
    private readonly utilsService: UtilsService
  ) {
    this.baseHref = environment.baseHref;
  }

  toggle = (event: MouseEvent, data: T) => {
    const menuItems = this.menuItems(data);
    this.actionMenu.model = this.filter(menuItems, data);
    this.actionMenu.toggle(event);
  };

  protected abstract menuItems: (data: T) => MenuItensWithPermissions[];

  protected filter(items: MenuItensWithPermissions[], data?: T): MenuItem[] {
    if (Utils.isEmpty(items)) {
      return [];
    }
    const roles = this.utilsService.getUserRoles();
    if (Utils.isEmpty(roles)) {
      return [];
    }

    if (roles.includes(ROLES.ADMIN)) {
      return items;
    }

    return items.filter(
      (item) =>
        !Utils.isEmpty(item.rolesAllowed) &&
        item.rolesAllowed.some((rolesAllowed) => roles.includes(rolesAllowed))
    );
  }
}
