//Angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

//Internos
import { ItensMenu } from './itens-menu';

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
  get itensMenu() {
    return ItensMenu;
  }
}
