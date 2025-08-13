//Angular
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';

//Externos
import {
  auditTime,
  BehaviorSubject,
  finalize,
  Observable,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

//Internos
import { Marca } from '@marca/interfaces/marca';
import { MarcaQueryService } from '@marca/service/marca-query.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { MarcaTableComponent } from '@marca/components/marca-table/marca-table.component';
import { MarcaFiltersComponent } from '@marca/components/marca-filters/marca-filters.component';

@Component({
  selector: 'app-marca-list',
  imports: [
    //Angular
    CommonModule,
    RouterModule,

    //Externos
    CardModule,
    DividerModule,

    //Internos
    LoadingComponent,
    MarcaTableComponent,
    MarcaFiltersComponent,
  ],
  templateUrl: './marca-list.component.html',
})
export class MarcaListComponent implements OnInit {
  public marcas$ = new Observable<Marca[]>();
  public readonly refresh$ = new BehaviorSubject<void>(null);
  public readonly loading$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly marcaQueryService: MarcaQueryService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData(formValue: any = null) {
    this.loading$.next(true);
    this.marcas$ = this.refresh$.pipe(
      startWith(undefined),
      //Impede que as ações sejam realizadas caso o refresh$ seja emitido mais de uma vez seguida em menos de 50ms
      auditTime(50),
      switchMap(() => {
        return this.marcaQueryService
          .searchByTermAndStatus(this.getParams(formValue))
          .pipe(
            take(1),
            finalize(() => this.loading$.next(false))
          );
      })
    );
  }

  onFilter(event) {
    this.loadData(event);
  }

  getParams(values) {
    let params = new URLSearchParams();
    if (values) {
      if (values.nome) {
        params.append('term', values.nome);
      }
      if (values.status) {
        params.append('status', values.status.key);
      }
      return params;
    }
    return null;
  }
}
