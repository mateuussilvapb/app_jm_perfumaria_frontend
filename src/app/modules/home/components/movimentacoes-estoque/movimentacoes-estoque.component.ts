//Angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

//Externos
import { DividerModule } from 'primeng/divider';

//Internos
import { ResumoMensalMovimentacaoEstoqueComponent } from '@home/components/movimentacoes-estoque/components/resumo-mensal-movimentacao-estoque/resumo-mensal-movimentacao-estoque.component';
import { ValoresMensaisMovimentacoesEstoqueComponent } from '@home/components/movimentacoes-estoque/components/valores-mensais-movimentacao-estoque/valores-mensais-movimentacoes-estoque.component';

@Component({
  selector: 'app-movimentacoes-estoque',
  imports: [
    //Angular
    CommonModule,

    //Externos
    DividerModule,

    //Internos
    ResumoMensalMovimentacaoEstoqueComponent,
    ValoresMensaisMovimentacoesEstoqueComponent
  ],
  templateUrl: './movimentacoes-estoque.component.html'
})
export class MovimentacoesEstoqueComponent { }
