//Angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

//Internos
import { ItemMenu, ItensMenu } from './itens-menu';
import { UtilsService } from '@utils/utils.service';

@Component({
  selector: 'app-menu',
  imports: [
    //Angular
    RouterLink,
    CommonModule,
    RouterLinkActive,
  ],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  constructor(private readonly utilsService: UtilsService) {}

  get itensMenu() {
    return ItensMenu;
  }

  hasUserPermissions(item: ItemMenu): boolean {
    let hasPermission = false;
    if (item.roles && item.roles.length > 0) {
      const userRoles = this.utilsService.getUserRoles();
      item.roles?.forEach((role) => {
        if (userRoles.includes(role)) {
          hasPermission = true;
        }
      });
    } else {
      hasPermission = true;
    }
    return hasPermission;
  }
}
