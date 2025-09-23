import { AutocompleteDto } from "@shared/interfaces/autocomplete-dto";
import { Utils } from "@utils/utils";

export class MovimentacaoEstoqueFilterDto {
  dataInicial: string;
  dataFinal: string;
  descricao: string;
  idsProdutos: Array<string>;
  idsMarcas: Array<string>;
  idsCategorias: Array<string>;
  descontoMin: number;
  descontoMax: number;
  situacao: string;

  constructor(obj: any) {
    if (obj) {
      this.tratarDatas(obj.datas);
      this.tratarDescontos(obj.descontos);
      this.descricao = obj.descricao ?? null;
      this.situacao = obj.situacao?.key ?? null;
      this.idsMarcas = this.tratarIdsCampos(obj.marcas);
      this.idsProdutos = this.tratarIdsCampos(obj.produtos);
      this.idsCategorias = this.tratarIdsCampos(obj.categorias);
    }
  }

  private tratarDatas(datas: any) {
    if (!datas){
      this.dataInicial = null;
      this.dataFinal = null;
    } else {
      this.dataInicial = datas[0] ? Utils.formatarLocalDate(new Date(datas[0])) : null;
      this.dataFinal = datas[1] ? Utils.formatarLocalDate(new Date(datas[1])) : null;
    }
  }

  private tratarIdsCampos(itens: Array<AutocompleteDto>): Array<string> {
    if (!itens || itens.length === 0) {
      return [];
    }
    return itens.map(p => p.value);
  }

  private tratarDescontos(descontos: any) {
    if (!descontos) {
      this.descontoMin = null;
      this.descontoMax = null;
    } else {
      this.descontoMin = this.calcularDesconto(descontos[0]);
      this.descontoMax = this.calcularDesconto(descontos[1]);
    }
  }

  private calcularDesconto(desconto: number) {
    if (!desconto || desconto == 0 || typeof desconto != 'number') {
      return null;
    }
    return desconto * 0.01;
  }
}

