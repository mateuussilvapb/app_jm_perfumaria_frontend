//Angular
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

//Externos

//Internos
import { LayoutService } from './../services/layout.service';
import { FooterComponent } from '../components/footer/footer.component';
import { TopbarComponent } from '../components/topbar/topbar.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  imports: [
    //Angular
    CommonModule,
    RouterOutlet,

    //Externos

    //Internos
    TopbarComponent,
    SidebarComponent,
    FooterComponent,
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  constructor(public readonly layoutService: LayoutService) {}
}
