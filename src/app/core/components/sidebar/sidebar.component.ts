//Angular
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

//Externos
import { filter, Subscription } from 'rxjs';
import { DrawerModule } from 'primeng/drawer';

//Internos
import { MenuComponent } from './menu/menu.component';
import { LayoutService } from 'app/core/services/layout.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    //Externos
    DrawerModule,

    //Internos
    MenuComponent,
  ],
  template: `
    @if(this.layoutService.isDesktop && this.layoutService.mainMenuVisible) {
    <div [@slide] class="layout-sidebar">
      <app-menu></app-menu>
    </div>
    } @if(this.layoutService.isMobile){
    <div>
      <p-drawer
        [showCloseIcon]="false"
        [(visible)]="this.layoutService.mainMenuVisible"
      >
        <app-menu></app-menu
      ></p-drawer>
    </div>
    }
  `,
  animations: [
    trigger('slide', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('100ms', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('100ms', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class SidebarComponent {
  private routerSubscription: Subscription;

  constructor(
    private readonly router: Router,
    public readonly layoutService: LayoutService
  ) {}

  public get showMenuDesktop() {
    return this.layoutService.isDesktop && this.layoutService.mainMenuVisible;
  }

  public get showMenuMobile() {
    debugger;
    return this.layoutService.isMobile && this.layoutService.mainMenuVisible;
  }

  set showMenuMobile(_val: boolean) {
    this.layoutService.mainMenuVisible = _val;
  }

  set showMenuDesktop(_val: boolean) {
    this.layoutService.mainMenuVisible = _val;
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.layoutService.isMobile) {
          this.layoutService.mainMenuVisible = false;
        }
      });
  }
}
