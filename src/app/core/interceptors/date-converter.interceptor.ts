//Angular
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

//Externos
import { Observable, map } from 'rxjs';

//Internos
import { getAdjustedDateIfPossible } from '@utils/extras/date.utils';

@Injectable()
export class DateConverterInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request.clone()).pipe(map(this.mapEvent));
  }

  private readonly mapEvent = (event: any) => {
    if (event instanceof HttpResponse) {
      if (event.body instanceof Blob) {
        return event;
      } else {
        return this.convertDates(event);
      }
    } else {
      return event;
    }
  };

  private readonly convertDates = (response: HttpResponse<any>): HttpResponse<any> => {
    const body = JSON.parse(JSON.stringify(response.body));
    const clonedResponse = response.clone({ body });
    this.traverse(clonedResponse.body);
    return new HttpResponse({
      body: clonedResponse.body,
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    });
  };

  private readonly traverse = (obj: any): void => {
    if (typeof obj === 'string') {
      return;
    }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string') {
          obj[key] = getAdjustedDateIfPossible(obj[key]);
        } else if (typeof obj[key] === 'object') {
          this.traverse(obj[key]);
        }
      }
    }
  };
}
