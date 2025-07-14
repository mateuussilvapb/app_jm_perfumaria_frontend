//Angular
import { Component, Input } from '@angular/core';

//Externos
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

//Internos
import { STATUS } from '@shared/enums/status.enum';
import { StatusPipe } from '@shared/pipes/status.pipe';
import { Categoria } from '@categoria/interfaces/categoria';
import { SemDadosComponent } from '@shared/components/sem-dados/sem-dados.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria-table',
  imports: [
    //Angular
    CommonModule,

    //Externos
    TableModule,
    ButtonModule,

    //Internos
    StatusPipe,
    SemDadosComponent,
  ],
  templateUrl: './categoria-table.component.html',
})
export class CategoriaTableComponent {
  @Input() data: Array<Categoria> = [];

  readonly STATUS = STATUS;
}
