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
import { EntradaEstoque } from '@entrada-estoque/interfaces/entrada-estoque';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { EntradaEstoqueQueryService } from '@entrada-estoque/services/entrada-estoque-query.service';
import { EntradaEstoqueTableComponent } from '@entrada-estoque/components/entrada-estoque-table/entrada-estoque-table.component';

@Component({
  selector: 'app-entrada-estoque-list',
  imports: [
    //Angular
    CommonModule,
    RouterModule,

    //Externos
    CardModule,
    DividerModule,

    //Internos
    LoadingComponent,
    EntradaEstoqueTableComponent,
  ],
  templateUrl: './entrada-estoque-list.component.html',
})
export class EntradaEstoqueListComponent implements OnInit {
  public readonly refresh$ = new BehaviorSubject<void>(null);
  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public entradasEstoque$ = new Observable<Array<Partial<EntradaEstoque>>>();

  constructor(
    private readonly entradaEstoqueQueryService: EntradaEstoqueQueryService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(formValue: any = null) {
    this.loading$.next(true);
    this.entradasEstoque$ = this.refresh$.pipe(
      startWith(undefined),
      //Impede que as ações sejam realizadas caso o refresh$ seja emitido mais de uma vez seguida em menos de 50ms
      auditTime(50),
      switchMap(() => {
        return this.entradaEstoqueQueryService.all().pipe(
          take(1),
          finalize(() => this.loading$.next(false))
        );
      })
    );
  }
}
