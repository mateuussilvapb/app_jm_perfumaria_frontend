//Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

//Externos
import { CardModule } from 'primeng/card';
import { BehaviorSubject, finalize, Observable, take } from 'rxjs';

//Internos
import { Categoria } from '@categoria/interfaces/categoria';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { CategoriaQueryService } from '@categoria/service/categoria-query.service';
import { CategoriaFiltersComponent } from '@categoria/components/categoria-filters/categoria-filters.component';

@Component({
  selector: 'app-categoria-list',
  imports: [
    //Angular
    CommonModule,

    //Externos
    CardModule,

    //Internos
    LoadingComponent,
    CategoriaFiltersComponent,
  ],
  templateUrl: './categoria-list.component.html',
})
export class CategoriaListComponent implements OnInit {
  public categorias$ = new Observable<Categoria[]>();
  // public readonly refresh$ = new BehaviorSubject<void>(null);
  public readonly loading$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly categoriaQueryService: CategoriaQueryService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loading$.next(true);
    this.categorias$ = this.categoriaQueryService.all().pipe(
      take(1),
      finalize(() => this.loading$.next(false))
    );
  }
}
