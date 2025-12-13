//Angular
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { LayoutService } from '@core/services/layout.service';
import { TIPO_CARD_INDICADOR_ENUM } from '@shared/enums/tipo-card-indicador.enum';
import { TIPO_CARD_INDICADOR, TIPOS_ICONES } from '@utils/constants';

//Externos  
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-card-indicador',
  imports: [
    //Angular
    CommonModule,

    //Externos
    CardModule,
    TooltipModule,
    DividerModule,
  ],
  templateUrl: './card-indicador.component.html',
})
export class CardIndicadorComponent implements OnInit {
  @Input() tipoCard: TIPO_CARD_INDICADOR;
  @Input({required: true}) titulo: string;
  @Input() tooltip?: string;
  @Input() icone?: TIPOS_ICONES;
  @Input() duasColunas: boolean = false;
  @Input({ required: true }) valorColunaUm: string | number = '';
  @Input() valorColunaDois?: string | number;

  public estiloClasseCard: string = 'border-2 h-full shadow-3 hover:shadow-5 transition-linear transition-duration-200 ';
  public estiloClasseIcone: string = 'pi border-round-lg p-2 text-xl text-white ';
  public estiloTitulo: string = 'flex flex-row justify-content-start align-items-center gap-1 min-w-0	flex-1 ';
  public estiloSubTitulo: string = 'p-card-subtitle text-start ';

  constructor(private readonly layoutService: LayoutService) {}

  ngOnInit(): void {
    this.definirClassesDeEstilo();
  }

  private definirClassesDeEstilo(): void {
    switch (this.tipoCard) {
      case TIPO_CARD_INDICADOR_ENUM.SURFACE:
        this.definirEstiloSurface();
        break;
      case TIPO_CARD_INDICADOR_ENUM.PRIMARY:
        this.definirEstiloPrimary();
        break;
      case TIPO_CARD_INDICADOR_ENUM.BLUE:
        this.definirEstiloBlue();
        break;
      case TIPO_CARD_INDICADOR_ENUM.GREEN:
        this.definirEstiloGreen();
        break;
      case TIPO_CARD_INDICADOR_ENUM.YELLOW:
        this.definirEstiloYellow();
        break;
      case TIPO_CARD_INDICADOR_ENUM.CYAN:
        this.definirEstiloCyan();
        break;
      case TIPO_CARD_INDICADOR_ENUM.PINK:
        this.definirEstiloPink();
        break;
      case TIPO_CARD_INDICADOR_ENUM.INDIGO:
        this.definirEstiloIndigo();
        break;
      case TIPO_CARD_INDICADOR_ENUM.TEAL:
        this.definirEstiloTeal();
        break;
      case TIPO_CARD_INDICADOR_ENUM.ORANGE:
        this.definirEstiloOrange();
        break;
      case TIPO_CARD_INDICADOR_ENUM.BLUEGRAY:
        this.definirEstiloBlueGray();
        break;
      case TIPO_CARD_INDICADOR_ENUM.PURPLE:
        this.definirEstiloPurple();
        break;
      case TIPO_CARD_INDICADOR_ENUM.GRAY:
        this.definirEstiloGray();
        break;
      case TIPO_CARD_INDICADOR_ENUM.RED:
        this.definirEstiloRed();
        break;
      default:
        this.definirEstiloDefault();
        break;
    }    
  }

  private definirEstiloSurface() {
    this.estiloClasseCard = this.estiloClasseCard + 'border-500';
    this.estiloClasseIcone = this.estiloClasseIcone + 'surface-500';
    this.estiloTitulo = this.estiloTitulo + 'text-500';
    this.estiloSubTitulo = this.estiloSubTitulo + 'text-400';
  }

  private definirEstiloPrimary() {
    this.estiloClasseCard = this.estiloClasseCard + 'border-primary';
    this.estiloClasseIcone = this.estiloClasseIcone + 'bg-primary';
    this.estiloTitulo = this.estiloTitulo + 'text-primary';
    this.estiloSubTitulo = this.estiloSubTitulo + 'text-primary'; 
  }

  private definirEstiloBlue() {
    this.estiloClasseCard = this.estiloClasseCard + 'border-blue-500';
    this.estiloClasseIcone = this.estiloClasseIcone + 'bg-blue-500';
    this.estiloTitulo = this.estiloTitulo + 'text-blue-500';
    this.estiloSubTitulo = this.estiloSubTitulo + 'text-blue-400';
  }

  private definirEstiloGreen() {
    this.estiloClasseCard = this.estiloClasseCard + 'border-green-500';
    this.estiloClasseIcone = this.estiloClasseIcone + 'bg-green-500';
    this.estiloTitulo = this.estiloTitulo + 'text-green-500';
    this.estiloSubTitulo = this.estiloSubTitulo + 'text-green-400';
  }

  private definirEstiloYellow() {
    this.estiloClasseCard = this.estiloClasseCard + 'border-yellow-500';
    this.estiloClasseIcone = this.estiloClasseIcone + 'bg-yellow-500';
    this.estiloTitulo = this.estiloTitulo + 'text-yellow-500';
    this.estiloSubTitulo = this.estiloSubTitulo + 'text-yellow-400';
  }

  private definirEstiloCyan() {
    this.estiloClasseCard = this.estiloClasseCard + 'border-cyan-500';
    this.estiloClasseIcone = this.estiloClasseIcone + 'bg-cyan-500';
    this.estiloTitulo = this.estiloTitulo + 'text-cyan-500';
    this.estiloSubTitulo = this.estiloSubTitulo + 'text-cyan-400';
  }

  private definirEstiloPink() {
    this.estiloClasseCard = this.estiloClasseCard + 'border-pink-500';
    this.estiloClasseIcone = this.estiloClasseIcone + 'bg-pink-500';
    this.estiloTitulo = this.estiloTitulo + 'text-pink-500';
    this.estiloSubTitulo = this.estiloSubTitulo + 'text-pink-400';
  }

  private definirEstiloIndigo() {
    this.estiloClasseCard = this.estiloClasseCard + 'border-indigo-500';
    this.estiloClasseIcone = this.estiloClasseIcone + 'bg-indigo-500';
    this.estiloTitulo = this.estiloTitulo + 'text-indigo-500';
    this.estiloSubTitulo = this.estiloSubTitulo + 'text-indigo-400';
  }

  private definirEstiloTeal() {
    this.estiloClasseCard = this.estiloClasseCard + 'border-teal-500';
    this.estiloClasseIcone = this.estiloClasseIcone + 'bg-teal-500';
    this.estiloTitulo = this.estiloTitulo + 'text-teal-500';
    this.estiloSubTitulo = this.estiloSubTitulo + 'text-teal-400';
  }

  private definirEstiloOrange() {
    this.estiloClasseCard = this.estiloClasseCard + 'border-orange-500';
    this.estiloClasseIcone = this.estiloClasseIcone + 'bg-orange-500';
    this.estiloTitulo = this.estiloTitulo + 'text-orange-500';
    this.estiloSubTitulo = this.estiloSubTitulo + 'text-orange-400';
  }

  private definirEstiloBlueGray() {
    this.estiloClasseCard = this.estiloClasseCard + 'border-bluegray-500';
    this.estiloClasseIcone = this.estiloClasseIcone + 'bg-gray-600';
    this.estiloTitulo = this.estiloTitulo + 'text-bluegray-500';
    this.estiloSubTitulo = this.estiloSubTitulo + 'text-bluegray-400';
  }

  private definirEstiloPurple() {
    this.estiloClasseCard = this.estiloClasseCard + 'border-purple-500';
    this.estiloClasseIcone = this.estiloClasseIcone + 'bg-purple-500';
    this.estiloTitulo = this.estiloTitulo + 'text-purple-500';
    this.estiloSubTitulo = this.estiloSubTitulo + 'text-purple-400';
  }

  private definirEstiloGray() {
    this.estiloClasseCard = this.estiloClasseCard + 'border-gray-500';
    this.estiloClasseIcone = this.estiloClasseIcone + 'bg-gray-500';
    this.estiloTitulo = this.estiloTitulo + 'text-gray-500';
    this.estiloSubTitulo = this.estiloSubTitulo + 'text-gray-400';
  }

  private definirEstiloRed() {
    this.estiloClasseCard = this.estiloClasseCard + 'border-red-500';
    this.estiloClasseIcone = this.estiloClasseIcone + 'bg-red-500';
    this.estiloTitulo = this.estiloTitulo + 'text-red-500';
    this.estiloSubTitulo = this.estiloSubTitulo + 'text-red-400';
  }

  private definirEstiloDefault() {
    this.estiloClasseCard = this.estiloClasseCard + 'border-white';
    this.estiloClasseIcone = this.estiloClasseIcone + 'background-default-custom';
  }

  get fontSizeByScreenSize(): string {
    if (this.layoutService.isMobile) {
      return 'text-2xl';
    }
    return 'text-3xl';
  }
}
