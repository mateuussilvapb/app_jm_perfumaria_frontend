//Angular
import { Component, ViewChild } from '@angular/core';

//Externos
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-generic-pop-over',
  imports: [
    //Externos
    ButtonModule,
    PopoverModule,
  ],
  templateUrl: './generic-pop-over.component.html',
})
export class GenericPopOverComponent {
  @ViewChild('genericPopOver') genericPopOver!: Popover;

  acao?: () => void;
  mensagem: string = '';
  labelBtn: string = '';
  showBtnAction: boolean = false;


  public show(event: MouseEvent) {
    this.genericPopOver.toggle({ currentTarget: event.target });
  }

  public hide() {
    this.genericPopOver.toggle(false);
  }

  public executarAcao() {
    if (this.acao) {
      this.acao();
      this.hide();
    }
  }
}
