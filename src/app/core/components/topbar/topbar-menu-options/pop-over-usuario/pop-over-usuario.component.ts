//Angular
import { Component, inject, OnInit, ViewChild } from '@angular/core';

//Externos
import Keycloak from 'keycloak-js';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';

//Internos
import { LayoutService } from '@core/services/layout.service';
import { DialogAlterarSenhaComponent } from '@core/components/topbar/topbar-menu-options/dialog-alterar-senha/dialog-alterar-senha.component';

@Component({
  selector: 'app-pop-over-usuario',
  imports: [
    //Externos
    ButtonModule,
    PopoverModule,
  ],
  templateUrl: './pop-over-usuario.component.html',
})
export class PopOverUsuarioComponent implements OnInit {
  @ViewChild('popOverUsuario') popOverUsuario!: Popover;
  private readonly keycloak = inject(Keycloak);
  userDetails: any;

  constructor(
    private readonly dialogService: DialogService,
    private readonly layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  public show(event: MouseEvent) {
    this.popOverUsuario.toggle({ currentTarget: event.target });
  }

  async loadUserData() {
    this.userDetails = await this.keycloak.loadUserProfile();
  }

  onChangePassword() {
    let width: string = '15vw';
    let height: string = 'auto';
    let styleClass: string = '';

    if (this.layoutService.isMobile) {
      width = '100vw';
      height = '100vh';
      styleClass = 'max-h-full';
      this.layoutService.state.sidebarMenuOptionsVisible = false;
    }

    this.popOverUsuario.toggle(false);

    const configDialog: DynamicDialogConfig = {
      modal: true,
      width: width,
      height: height,
      baseZIndex: 10000,
      styleClass: styleClass,
      header: 'Alterar Senha',
      contentStyle: { overflow: 'hidden', height: 'auto' },
    };

    const ref = this.dialogService.open(
      DialogAlterarSenhaComponent,
      configDialog
    );
  }
}
