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

//Internos
import { CustomDialogService } from '@shared/services/custom-dialog.service';

const UNAUTHORIZED = 403;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly customDialogService: CustomDialogService,
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
    this.customDialogService.openDialog(message, 'error')
  };
}
