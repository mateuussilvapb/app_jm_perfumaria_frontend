//Angular
import { Injectable } from '@angular/core';

//Externos
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';

//Internos
import { LayoutService } from '@core/services/layout.service';
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CustomDialogService {

  constructor(
    private readonly dialogService: DialogService,
    private readonly layoutService: LayoutService,
  ) {}

  openDialog(message: string, type: 'success' | 'error' | 'info' = 'info') {
    let width: string = '30vw';
    let height: string = 'auto';
    let styleClass: string = 'generic-dialog ';

    styleClass += this.definirStyleClassDialog(type);

    if (this.layoutService.isMobile) {
      width = '100vw';
      height = '100vh';
      styleClass += ' max-h-full';
      this.layoutService.state.sidebarMenuOptionsVisible = false;
    }

    const configDialog: DynamicDialogConfig = {
      modal: true,
      width: width,
      height: height,
      baseZIndex: 10000,
      styleClass: styleClass,
      data: { type: type, message: message },
      contentStyle: { overflow: 'hidden', height: 'auto' },
    };

    this.dialogService.open(GenericDialogComponent, configDialog);
  }

  private definirStyleClassDialog(type: 'success' | 'error' | 'info' = 'info') {
    if (type === 'success') {
      return 'dialog-success';
    } else if (type === 'error') {
      return 'dialog-error';
    }
    return 'dialog-warn';
  }
}
