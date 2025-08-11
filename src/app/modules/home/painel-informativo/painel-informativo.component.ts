import { Component } from '@angular/core';
import { BarVendasComponent } from './bar-vendas/bar-vendas.component';
import { BarRendimentoMarcasCategoriasComponent } from './bar-rendimento-m-c/bar-rendimento-m-c.component';
import { PieVendasComponent } from './pie-vendas/pie-vendas.component';
import { EntradaSaidaComponent } from './entrada-saida/entrada-saida.component';
import { TicketVendasComponent } from './ticket-vendas/ticket-vendas.component';
import { LucroPeriodoComponent } from './lucro-periodo/lucro-periodo.component';
import { EstoqueMarcaCategoriaComponent } from './estoque-marca-categoria/estoque-marca-categoria.component';

@Component({
  selector: 'painel-informativo',
  templateUrl: 'painel-informativo.component.html',
  standalone: true,
  imports: [
    BarVendasComponent,
    BarRendimentoMarcasCategoriasComponent,
    PieVendasComponent,
    EntradaSaidaComponent,
    TicketVendasComponent,
    LucroPeriodoComponent,
    EstoqueMarcaCategoriaComponent
  ],
})
export class PainelInformativoComponent {}
