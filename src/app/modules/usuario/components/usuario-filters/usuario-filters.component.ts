//Angular
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

//Externos
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BehaviorSubject, map, startWith } from 'rxjs';

@Component({
  selector: 'app-usuario-filters',
  imports: [
    //Angular
    FormsModule,
    CommonModule,

    //Externos
    CardModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './usuario-filters.component.html',
})
export class UsuarioFiltersComponent implements OnInit {
  @Input() refresh$: BehaviorSubject<void>;
  @Output() filter = new EventEmitter<any>();
  public searchTerm: string = '';

  ngOnInit(): void {
    this.refresh$
      .pipe(
        startWith(undefined),
        map(() => {
          this.searchTerm = '';
          this.filter.emit();
        })
      )
      .subscribe();
  }

  onSubmit() {
    this.filter.emit(this.searchTerm);
  }

  limparCampos() {
    this.searchTerm = '';
    this.filter.emit(this.searchTerm);
  }

  disableButtonBuscar() {
    return this.searchTerm == '';
  }
}
