//Angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

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
import { UsuarioQueryService } from '@usuario/service/usuario-query.service';
import { UsuarioResponseDto } from '@usuario/interfaces/usuario-response-dto';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { UsuarioTableComponent } from '@usuario/components/usuario-table/usuario-table.component';
import { UsuarioFiltersComponent } from '@usuario/components/usuario-filters/usuario-filters.component';

@Component({
  selector: 'app-usuario-list',
  imports: [
    //Angular
    CommonModule,
    RouterModule,

    //Externos
    CardModule,
    DividerModule,

    //Internos
    LoadingComponent,
    UsuarioTableComponent,
    UsuarioFiltersComponent,
  ],
  templateUrl: './usuario-list.component.html',
})
export class UsuarioListComponent {
  public usuarios$ = new Observable<UsuarioResponseDto[]>();
  public readonly refresh$ = new BehaviorSubject<void>(null);
  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public readonly loadingActionsTable$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly usuarioQueryService: UsuarioQueryService) {}

  private loadData(searchTerm: string = '') {
    this.loading$.next(true);
    const filters = new URLSearchParams();
    filters.append('searchParam', searchTerm);
    this.usuarios$ = this.refresh$.pipe(
      startWith(undefined),
      //Impede que as ações sejam realizadas caso o refresh$ seja emitido mais de uma vez seguida em menos de 50ms
      auditTime(50),
      switchMap(() => {
        return this.usuarioQueryService.searchByTerm(filters).pipe(
          take(1),
          finalize(() => this.loading$.next(false))
        );
      })
    );
  }

  onFilter(event) {
    this.loadData(event);
  }
}
