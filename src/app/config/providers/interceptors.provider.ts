//Angular
import { HTTP_INTERCEPTORS } from '@angular/common/http';

//Internos
import { ErrorInterceptor } from 'app/core/interceptors/error.interceptor';
import { DateConverterInterceptor } from 'app/core/interceptors/date-converter.interceptor';

export const INTERCEPTORS_PROVIDERS = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: DateConverterInterceptor,
    multi: true,
  },
];
