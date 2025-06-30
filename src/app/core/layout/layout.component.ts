import { LayoutService } from './../services/layout.service';
//Angular
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

//Externos
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

//Internos
import { TopbarComponent } from '../components/topbar/topbar.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [
    //Angular
    CommonModule,
    RouterOutlet,

    //Externos
    CardModule,
    ButtonModule,

    //Internos
    TopbarComponent,
    SidebarComponent,
    FooterComponent,
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {

  constructor(public readonly layoutService: LayoutService) {}

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('app_jm_perfumaria');
  }
}
