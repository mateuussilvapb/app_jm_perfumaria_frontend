import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  width$: Observable<number>;

  constructor() {
    this.width$ = fromEvent(window, 'resize').pipe(
      map(event => (event.target as Window).innerWidth),
      startWith(window.innerWidth)
    );
  }
}
