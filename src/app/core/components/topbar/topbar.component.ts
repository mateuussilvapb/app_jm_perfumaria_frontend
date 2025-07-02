//Angular
import { Component } from '@angular/core';

//Externos
import { ButtonModule } from 'primeng/button';

//Internos
import { LayoutService } from 'app/core/services/layout.service';
import { SidebarMobileComponent } from './sidebar-mobile/sidebar-mobile.component';
import { TopbarMenuOptionsComponent } from './topbar-menu-options/topbar-menu-options.component';

@Component({
  selector: 'app-topbar',
  imports: [
    //Externos
    ButtonModule,

    //Internos
    SidebarMobileComponent,
    TopbarMenuOptionsComponent,
  ],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  constructor(public readonly layoutService: LayoutService) {}
}
