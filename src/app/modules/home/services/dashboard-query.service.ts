//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Internos
import { AbstractQueryService } from '@shared/services/abstract-query.service';
import { InformacoesEstoqueDTO } from '@home/interfaces/indicadores/informacoes-estoque-dto';
import { ProdutosBaixaQuantidadeDTO } from '@home/interfaces/indicadores/produtos-baixa-quantidade-dto';
import { MovimentacoesEntradaSaidaEstoqueDTO } from '@home/interfaces/movimentacoes-estoque/movimentacoes-entrada-saida-estoque-dto';
import { ProdutosBaixaMovimentacaoEstoqueDTO } from '@home/interfaces/indicadores/produtos-baixa-movimentacao-estoque-dto';
import { ValoresEntradaSaidaEstoqueDTO } from '@home/interfaces/movimentacoes-estoque/valores-entrada-saida-estoque-dto';

@Injectable({
  providedIn: 'root',
})
export class DashboardQueryService extends AbstractQueryService<any> {
  protected override path = (): string => 'dashboard';

  constructor(http: HttpClient) {
    super(http);
  }

  getInformacoesEstoque = () => {
    return this.http.get<InformacoesEstoqueDTO>(
      `${this.baseURL}/query/valor-total-estoque`
    );
  };

  getProdutosBaixaQuantidadeEstoque = () => {
    return this.http.get<ProdutosBaixaQuantidadeDTO[]>(
      `${this.baseURL}/query/produtos-baixa-quantidade`
    );
  };

  getProdutosBaixaMovimentacaoEstoque = () => {
    return this.http.get<ProdutosBaixaMovimentacaoEstoqueDTO[]>(
      `${this.baseURL}/query/produtos-sem-movimentacao`
    );
  };

  getResumoMensalMovimentacaoEstoque = () => {
    return this.http.get<MovimentacoesEntradaSaidaEstoqueDTO>(
      `${this.baseURL}/query/resumo-mensal-movimentacao-estoque`
    );
  };

  getValoresMensaisMovimentacaoEstoque = () => {
    return this.http.get<ValoresEntradaSaidaEstoqueDTO>(
      `${this.baseURL}/query/resumo-valores-movimentacao-estoque`
    );
  };
}
