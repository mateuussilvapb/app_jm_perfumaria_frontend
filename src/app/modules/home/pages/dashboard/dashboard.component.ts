//Angular
import { Component } from '@angular/core';

//Externos
import { DividerModule } from 'primeng/divider';

//Internos
import { IndicadoresComponent } from '@home/components/indicadores/indicadores.component';
import { MovimentacoesEstoqueComponent } from '@home/components/movimentacoes-estoque/movimentacoes-estoque.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    //Externos
    DividerModule,

    //Internos
    IndicadoresComponent,
    MovimentacoesEstoqueComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
