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
import { MessageService } from 'primeng/api';

const UNAUTHORIZED = 403;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private readonly messageService: MessageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req.clone()).pipe(catchError(this.handleError));
  }

  private readonly handleError = (error: HttpErrorResponse) => {
    console.error('>>> ERROR> ', error, ' <<<');
    if (error.status === UNAUTHORIZED) {
      this.showMessage(
        'Operação não permitida. Entre em contato com o administrador do sistema.'
      );
    } else if (error.error?.message) {
      this.showMessage(error.error.message);
    } else {
      this.showMessage(
        'Erro inesperado. Entre em contato com o administrador do sistema.'
      );
    }
    throw error;
  };

  private readonly showMessage = (message: string) => {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: message,
      life: 5000,
    });
  };
}
