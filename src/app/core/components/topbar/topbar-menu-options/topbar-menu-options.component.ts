//Angular
import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';

//Externos
import Keycloak from 'keycloak-js';
import { ButtonModule } from 'primeng/button';

//Internos
import { LayoutService } from 'app/core/services/layout.service';
import { PopOverUsuarioComponent } from './pop-over-usuario/pop-over-usuario.component';


@Component({
  selector: 'app-topbar-menu-options',
  imports: [
    //Angular
    CommonModule,

    //Externos
    ButtonModule,

    //Internos
    PopOverUsuarioComponent,
  ],
  template: `
    <button
      pButton
      pRipple
      [outlined]="true"
      class="menu-buttons"
      severity="secondary"
      [icon]="getIconThemeMode"
      (click)="this.toggleDarkMode()"
    ></button>

    <button
      pButton
      pRipple
      icon="pi pi-user"
      [outlined]="true"
      severity="secondary"
      class="menu-buttons"
      [ngClass]="{
        'ml-2': this.layoutService.isDesktop,
        'mt-2': !this.layoutService.isDesktop,
      }"
      (click)="togglePopOverUsuario($event)"
    ></button>

    <button
      pButton
      pRipple
      [outlined]="true"
      severity="secondary"
      class="menu-buttons"
      icon="pi pi-sign-out"
      [ngClass]="{
        'ml-2': this.layoutService.isDesktop,
        'mt-2': !this.layoutService.isDesktop,
      }"
      (click)="this.logout()"
    ></button>

    <app-pop-over-usuario></app-pop-over-usuario>
  `,
})
export class TopbarMenuOptionsComponent {
  private readonly keycloak = inject(Keycloak);

  @ViewChild(PopOverUsuarioComponent)
  popOverUsuarioComponent!: PopOverUsuarioComponent;

  constructor(public readonly layoutService: LayoutService) {}

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('app_jm_perfumaria');
    this.layoutService.layoutConfig.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme,
    }));
    this.layoutService.onToggleTheme();
  }

  get getIconThemeMode() {
    if (this.layoutService.isDarkTheme()) {
      return 'pi pi-moon';
    }
    return 'pi pi-sun';
  }

  togglePopOverUsuario(event: MouseEvent) {
    this.popOverUsuarioComponent.show(event);
  }

  logout() {
    this.keycloak.logout();
  }
}
