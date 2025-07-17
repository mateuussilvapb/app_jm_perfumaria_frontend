//Angular
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';

//Externos
import {
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
import { Categoria } from '@categoria/interfaces/categoria';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { CategoriaQueryService } from '@categoria/service/categoria-query.service';
import { CategoriaTableComponent } from '@categoria/components/categoria-table/categoria-table.component';
import { CategoriaFiltersComponent } from '@categoria/components/categoria-filters/categoria-filters.component';

@Component({
  selector: 'app-categoria-list',
  imports: [
    //Angular
    CommonModule,
    RouterModule,

    //Externos
    CardModule,
    DividerModule,

    //Internos
    LoadingComponent,
    CategoriaTableComponent,
    CategoriaFiltersComponent,
  ],
  templateUrl: './categoria-list.component.html',
})
export class CategoriaListComponent implements OnInit {
  public categorias$ = new Observable<Categoria[]>();
  public readonly refresh$ = new BehaviorSubject<boolean>(null);
  public readonly loading$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly categoriaQueryService: CategoriaQueryService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData(formValue: any = null) {
    this.loading$.next(true);
    this.categorias$ = this.refresh$.pipe(
      startWith(undefined),
      switchMap((value) => {
        console.log(value);
        return this.categoriaQueryService
          .searchByTermAndStatus(this.getParams(value ? null : formValue))
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
