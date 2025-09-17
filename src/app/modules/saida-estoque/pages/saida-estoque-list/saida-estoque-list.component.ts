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
import { Utils } from '@utils/utils';
import { SaidaEstoque } from '../../interfaces/saida-estoque';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { SaidaEstoqueQueryService } from '../../services/saida-estoque-query.service';
import { SaidaEstoqueTableComponent } from '../../components/saida-estoque-table/saida-estoque-table.component';
import { SaidaEstoqueFiltersComponent } from '../../components/saida-estoque-filters/saida-estoque-filters.component';
import { UtilsService } from '@utils/utils.service';

@Component({
  selector: 'app-saida-estoque-list',
  imports: [
    //Angular
    CommonModule,
    RouterModule,

    //Externos
    CardModule,
    DividerModule,

    //Internos
    LoadingComponent,
    SaidaEstoqueTableComponent,
    SaidaEstoqueFiltersComponent,
  ],
  templateUrl: './saida-estoque-list.component.html',
})
export class SaidaEstoqueListComponent implements OnInit {
  public readonly refresh$ = new BehaviorSubject<void>(null);
  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public saidasEstoque$ = new Observable<Array<Partial<SaidaEstoque>>>();

  constructor(
    private readonly saidaEstoqueQueryService: SaidaEstoqueQueryService,
    private readonly utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(formValue: any = null) {
    this.loading$.next(true);
    this.saidasEstoque$ = this.refresh$.pipe(
      startWith(undefined),
      //Impede que as ações sejam realizadas caso o refresh$ seja emitido mais de uma vez seguida em menos de 50ms
      auditTime(50),
      switchMap(() => {
        return this.saidaEstoqueQueryService.getAllByFilters(formValue).pipe(
          take(1),
          finalize(() => this.loading$.next(false))
        );
      })
    );
  }

  onFilter(event) {
    const params = Utils.getSearchParamsFromObj(event);
    this.loadData(params);
  }

  showAddButton() {
    const roles = this.utilsService.getUserRoles();
    return roles.includes('admin') || roles.includes('manager');
  }
}
