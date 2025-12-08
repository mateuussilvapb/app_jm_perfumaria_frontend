//Angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

//Externos
import { DividerModule } from 'primeng/divider';

//Internos
import { ResumoMensalSaidasEstoqueComponent } from '@home/components/movimentacoes-estoque/components/resumo-mensal-saidas-estoque/resumo-mensal-saidas-estoque.component';

@Component({
  selector: 'app-movimentacoes-estoque',
  imports: [
    //Angular
    CommonModule,

    //Externos
    DividerModule,

    //Internos
    ResumoMensalSaidasEstoqueComponent
  ],
  templateUrl: './movimentacoes-estoque.component.html'
})
export class MovimentacoesEstoqueComponent { }
