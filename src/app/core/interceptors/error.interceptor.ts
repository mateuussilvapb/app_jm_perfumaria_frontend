//Angular
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

//Externos
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';

//Internos
import { LayoutService } from '@core/services/layout.service';
import { GenericDialogComponent } from '@shared/components/generic-dialog/generic-dialog.component';

const UNAUTHORIZED = 403;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly dialogService: DialogService,
    private readonly layoutService: LayoutService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req.clone()).pipe(catchError(this.handleError));
  }

  private readonly handleError = (error: HttpErrorResponse) => {
    console.error('>>> ERROR> ', error, ' <<<');
    if (error.status === UNAUTHORIZED) {
      this.showErrorDialog(
        'Operação não permitida. Entre em contato com o administrador do sistema.'
      );
    } else if (error.error?.message) {
      this.showErrorDialog(error.error.message);
    } else {
      this.showErrorDialog(
        'Erro inesperado. Entre em contato com o administrador do sistema.'
      );
    }
    throw error;
  };

  private readonly showErrorDialog = (message: string) => {
    let width: string = '30vw';
    let height: string = 'auto';
    let styleClass: string = 'generic-dialog';

    if (this.layoutService.isMobile) {
      width = '100vw';
      height = '100vh';
      styleClass = 'max-h-full generic-dialog';
      this.layoutService.state.sidebarMenuOptionsVisible = false;
    }

    const configDialog: DynamicDialogConfig = {
      modal: true,
      width: width,
      height: height,
      baseZIndex: 10000,
      styleClass: styleClass,
      data: { type: 'error', message: message },
      contentStyle: { overflow: 'hidden', height: 'auto' },
    };

    this.dialogService.open(
      GenericDialogComponent,
      configDialog
    );

  };
}
