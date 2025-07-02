//Angular
import { Component } from '@angular/core';

//Externos
import { DrawerModule } from 'primeng/drawer';

//Internos
import { TopbarMenuOptionsComponent } from '../topbar-menu-options/topbar-menu-options.component';
import { LayoutService } from 'app/core/services/layout.service';

@Component({
  selector: 'app-sidebar-mobile',
  imports: [
    //Externos
    DrawerModule,

    //Internos
    TopbarMenuOptionsComponent,
  ],
  template: `
    <p-drawer
      position="right"
      [(visible)]="visible"
      styleClass="layout-config-sidebar w-5rem"
      [transitionOptions]="'.3s cubic-bezier(0, 0, 0.2, 1)'"
    >
      <app-topbar-menu-options></app-topbar-menu-options>
    </p-drawer>
  `,
})
export class SidebarMobileComponent {
  constructor(public readonly layoutService: LayoutService) {}

  get visible(): boolean {
    return this.layoutService.state.sidebarMenuOptionsVisible;
  }

  set visible(_val: boolean) {
    this.layoutService.state.sidebarMenuOptionsVisible = _val;
  }
}
