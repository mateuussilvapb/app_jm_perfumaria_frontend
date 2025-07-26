//Angular
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';

//Externos
import {
  auditTime,
  BehaviorSubject,
  finalize,
  map,
  Observable,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

//Internos
import { LoadingComponent } from 'app/shared/components/loading/loading.component';
import { ProdutoQueryService } from 'app/modules/protudo/service/produto-query.service';
import { GenericFiltersComponent } from 'app/modules/protudo/components/generic-filters/generic-filters.component';
import { Produto } from '../../interfaces/produto';
import { ProdutoTableComponent } from '../../components/produto-table/produto-table.component';

@Component({
  selector: 'app-produto-list',
  imports: [
    //Angular
    CommonModule,
    RouterModule,

    //Externos
    CardModule,
    DividerModule,

    //Internos
    LoadingComponent,
    ProdutoTableComponent,
    GenericFiltersComponent,
  ],
  templateUrl: './produto-list.component.html',
})
export class ProdutoListComponent implements OnInit {
  public produto$ = new Observable<Produto[]>();
  public readonly refresh$ = new BehaviorSubject<void>(null);
  public readonly loading$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly produtoQueryService: ProdutoQueryService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData(formValue: any = null) {
    this.loading$.next(true);
    this.produto$ = this.refresh$.pipe(
      startWith(undefined),
      //Impede que as ações sejam realizadas caso o refresh$ seja emitido mais de uma vez seguida em menos de 50ms
      auditTime(50),
      switchMap(() => {
        return this.produtoQueryService
          .searchByTermAndStatus(this.getParams(formValue))
          .pipe(
            map((res: any) => res.content),
            tap((result) => console.log('Resultado da busca:', result)),
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

